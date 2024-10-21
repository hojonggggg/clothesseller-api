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

  async findAllSampleByWholesalerId(wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;
    const [samples, total] = await this.sampleRepository.findAndCount({
      where: { wholesalerId },
      relations: ['wholesalerProductOption', 'wholesalerProductOption.wholesalerProduct', 'sellerProfile', 'sellerProfile.deliveryman'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    
    for (const sample of samples) {
      sample.name = sample.wholesalerProductOption.wholesalerProduct.name;
      sample.color = sample.wholesalerProductOption.color;
      sample.size = sample.wholesalerProductOption.size;
      sample.quantity = sample.wholesalerProductOption.quantity;
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
}
