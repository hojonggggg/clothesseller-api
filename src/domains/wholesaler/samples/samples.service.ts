import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { WholesalerCreateSampleAutoDto } from './dto/wholesaler-create-sample-auto.dto';
import { WholesalerCreateSampleManualDto } from './dto/wholesaler-create-sample-manual.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerSamplesService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async createSampleAuto(wholesalerId: number, wholesalerCreateSampleAutoDto: WholesalerCreateSampleAutoDto): Promise<Sample> {
    const sample = this.sampleRepository.create({
      wholesalerId, 
      sellerType: 'AUTO',
      ...wholesalerCreateSampleAutoDto
    });
    return await this.sampleRepository.save(sample);
  }

  async createSampleManual(wholesalerId: number, wholesalerCreateSampleManualDto: WholesalerCreateSampleManualDto): Promise<Sample> {
    const sample = this.sampleRepository.create({
      wholesalerId, 
      sellerType: 'MANUAL',
      ...wholesalerCreateSampleManualDto
    });
    return await this.sampleRepository.save(sample);
  }

  async findAllSample(wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('sample.sellerProfile', 'sellerProfile')
      .where('sample.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('sample.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
          qb.orWhere('COALESCE(sample.sellerName, sellerProfile.name) LIKE :sellerName', { sellerName: `%${query}%` });
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
      if (sample.sellerType === 'AUTO') {
        sample.sellerName = sample.sellerProfile.name;
        const sellerAddress1 = sample.sellerProfile.address1;
        const sellerAddress2 = sample.sellerProfile.address2;
        sample.sellerAddress = sellerAddress1 + " " + sellerAddress2;
        sample.sellerMobile = sample.sellerProfile.mobile;
        if (sample.sellerProfile.deliveryman) {
          sample.deliverymanMobile = sample.sellerProfile.deliveryman.mobile;
        } else {
          sample.deliverymanMobile = null;
        }
      }
      delete(sample.wholesalerId);
      delete(sample.sellerType);
      delete(sample.sellerId);
      delete(sample.isDeleted);
      delete(sample.status);
      delete(sample.wholesalerProduct);
      delete(sample.wholesalerProductOption);
      delete(sample.sellerProfile);
    }
    
    return {
      list: samples,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async deleteSamples(wholesalerId: number, ids: number[]): Promise<void> {
    await this.sampleRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isDeleted: true
      }
    );
  }
}
