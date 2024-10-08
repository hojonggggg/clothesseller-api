import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerSamplesService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async findAllSampleByWholesalerId(wholesalerId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const [samples, total] = await this.sampleRepository.findAndCount({
      where: { wholesalerId },
      relations: ['productOption', 'productOption.wholesalerProduct', 'sellerProfile', 'sellerProfile.deliveryman'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    
    for (const sample of samples) {
      sample.name = sample.productOption.wholesalerProduct.name;
      sample.color = sample.productOption.color;
      sample.size = sample.productOption.size;
      sample.quantity = sample.productOption.quantity;
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
      delete(sample.wholesalerId);
      delete(sample.wholesalerProductOptionId);
      delete(sample.sellerId);
      delete(sample.productOption);
      delete(sample.sellerProfile);
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
