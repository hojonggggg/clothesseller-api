import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Like } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { SellerCreateSampleDto } from './dto/seller-create-sample.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class SellerSamplesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async createSample(sellerId: number, sellerCreateSampleDto: SellerCreateSampleDto): Promise<Sample[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    const samples: Sample[] = [];

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { options } = sellerCreateSampleDto;
      for (const option of options) {
        const sample = this.sampleRepository.create({
          sellerId, 
          ...sellerCreateSampleDto, 
          wholesalerProductOptionId: option.wholesalerProductOptionId,
          quantity: option.quantity
        });
        const savedSample = await this.sampleRepository.save(sample);
        samples.push(savedSample);
      }

      await queryRunner.commitTransaction();
      return samples.reverse();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllSampleBySellerId(sellerId: number, productName: string, wholesalerName: string, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    /*
    const whereConditions: any = { sellerId };
    if (productName) {
      whereConditions.productName = Like(`%${productName}%`);
    }

    const [samples, total] = await this.sampleRepository.findAndCount({
      where: whereConditions,
      relations: ['wholesalerProfile', 'wholesalerProfile.store', 'wholesalerProduct', 'wholesalerProductOption'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */

    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .where('sample.sellerId = :sellerId', { sellerId });

    if (productName) {
      queryBuilder.andWhere('wholesalerProduct.name LIKE :productName', { productName: `%${productName}%` });
    }
    if (wholesalerName) {
      queryBuilder.andWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${wholesalerName}%` });
    }

    const [samples, total] = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    
    for (const sample of samples) {
      sample.name = sample.wholesalerProduct.name;
      sample.color = sample.wholesalerProductOption.color;
      sample.size = sample.wholesalerProductOption.size;
      sample.wholesalerName = sample.wholesalerProfile.name;
      sample.wholesalerStoreName = sample.wholesalerProfile.store.name;
      sample.wholesalerStoreRoomNo = sample.wholesalerProfile.roomNo;
      sample.wholesalerMobile = sample.wholesalerProfile.mobile;
      delete(sample.sellerId);
      delete(sample.wholesalerId);
      delete(sample.wholesalerProfile);
      delete(sample.wholesalerProductId);
      delete(sample.wholesalerProduct);
      delete(sample.wholesalerProductOptionId);
      delete(sample.wholesalerProductOption);
    }
    
    return {
      data: samples,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
