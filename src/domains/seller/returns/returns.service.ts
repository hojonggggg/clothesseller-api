import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Return } from 'src/commons/shared/entities/return.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class SellerReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async findAllReturnBySellerId(sellerId: number, productName: string, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    /*
    const [returns, total] = await this.returnRepository.findAndCount({
      where: { sellerId },
      //relations: ['sellerProductOption', 'sellerProductOption.sellerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */
    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .leftJoinAndSelect('return.sellerProduct', 'sellerProduct')
      .where('return.sellerId = :sellerId', { sellerId });

    if (productName) {
      queryBuilder.andWhere('sellerProduct.name LIKE :productName', { productName: `%${productName}%` });
    }

    const [returns, total] = await queryBuilder
      .orderBy('return.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    /*
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
    */
    return {
      list: returns,
      total,
      page: Number(page),
      totalPage: Math.ceil(total / limit),
    };
  }
}
