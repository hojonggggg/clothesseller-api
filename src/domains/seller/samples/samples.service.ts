import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class SellerSamplesService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async findAllSampleBySellerId(sellerId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const [samples, total] = await this.sampleRepository.findAndCount({
      where: { sellerId },
      relations: ['sellerProductOption', 'sellerProductOption.sellerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    
    for (const sample of samples) {
      sample.name = sample.sellerProductOption.sellerProduct.name;
      sample.color = sample.sellerProductOption.color;
      sample.size = sample.sellerProductOption.size;
      sample.quantity = sample.sellerProductOption.quantity;
      sample.wholesalerName = sample.wholesalerProfile.name;
      sample.wholesalerStoreName = sample.wholesalerProfile.store.name;
      sample.wholesalerStoreRoomNo = sample.wholesalerProfile.roomNo;
      sample.wholesalerMobile = sample.wholesalerProfile.mobile;
      delete(sample.wholesalerId);
      delete(sample.wholesalerProductOptionId);
      delete(sample.sellerId);
      delete(sample.sellerProductOptionId);
      delete(sample.sellerProductOption);
      delete(sample.wholesalerProfile);
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
