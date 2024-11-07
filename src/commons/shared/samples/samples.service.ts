import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Sample } from './entities/sample.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async findAllSampleForAdmin(query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .where('sample.isDeleted = 0');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sample.sellerName LIKE :sellerName', { sellerName: `%${query}%` })
            .orWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [samples, total] = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const sample of samples) {
      const { wholesalerProfile, wholesalerProduct, wholesalerProductOption } = sample;
      sample.wholesalerName = wholesalerProfile.name;
      sample.name = wholesalerProduct.name;
      sample.color = wholesalerProductOption.color;
      sample.size = wholesalerProductOption.size;
      delete(sample.wholesalerId);
      delete(sample.wholesalerProfile);
      delete(sample.sellerId);
      delete(sample.wholesalerProductId);
      delete(sample.wholesalerProduct);
      delete(sample.wholesalerProductOptionId);
      delete(sample.wholesalerProductOption);
      delete(sample.status);
      delete(sample.isDeleted);
    }

    return {
      list: samples,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findOneSampleForAdmin(sampleId: number) {
    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('sample.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('sample.id = :sampleId', { sampleId })
      .andWhere('sample.isDeleted = 0');

    const sample = await queryBuilder.getOne();
    const {wholesalerProduct, wholesalerProductOption, wholesalerProfile } = sample;

    sample.wholesalerProduct.price = formatCurrency(wholesalerProduct.price);
    sample.wholesalerProduct.color = wholesalerProductOption.color;
    sample.wholesalerProduct.size = wholesalerProductOption.size;
    sample.wholesalerProfile.storeName = wholesalerProfile.store.name;
    delete(sample.wholesalerProductId);
    delete(sample.wholesalerProduct.id);
    delete(sample.wholesalerProduct.wholesalerId);
    delete(sample.wholesalerProductOptionId);
    delete(sample.wholesalerProductOption);
    delete(sample.wholesalerId);
    delete(sample.wholesalerProfile.userId);
    delete(sample.wholesalerProfile.storeId);
    delete(sample.wholesalerProfile.store);
    delete(sample.status);
    delete(sample.isDeleted);

    return sample;
  }
}
