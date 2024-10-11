import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { Return } from 'src/commons/shared/entities/return.entity';
import { SellerCreateSampleDto } from './dto/seller-create-sample.dto';
import { SellerDeleteSampleDto } from './dto/seller-delete-sample.dto';
import { SellerReturnSampleDto } from './dto/seller-return-sample.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class SellerSamplesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
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

  async findAllSampleBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
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
      .where('sample.sellerId = :sellerId', { sellerId })
      .andWhere('sample.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }

    const [samples, total] = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
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
      list: samples,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async deleteSample(sellerId: number, sellerDeleteSampleDtos: SellerDeleteSampleDto[]): Promise<void> {
    for (const sellerDeleteSampleDto of sellerDeleteSampleDtos) {
      const sampleId = sellerDeleteSampleDto.id;

      await this.sampleRepository.update(
        {
          id: sampleId,
          sellerId
        }, {
          isDeleted: true
        }
      );
    }
  }

  async returnSample(sellerId: number, sellerReturnSampleDtos: SellerReturnSampleDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    
      for (const sellerReturnSampleDto of sellerReturnSampleDtos) {
        const sampleId = sellerReturnSampleDto.id;

        await this.sampleRepository.update(
          {
            id: sampleId,
            sellerId
          }, {
            status: '반납'
          }
        );

        const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
          .where('sample.id = :sampleId', { sampleId });
        const sample = await queryBuilder.getOne();
        const { wholesalerId, wholesalerProductId, wholesalerProductOptionId, quantity } = sample;

        const returnProduct = this.returnRepository.create({
          type: '샘플상품',
          wholesalerId,
          wholesalerProductId,
          wholesalerProductOptionId,
          sellerId,
          sellerProductId: 0,
          sellerProductOptionId: 0,
          quantity,
          price: 0
        });

        await this.returnRepository.save(returnProduct);

      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
