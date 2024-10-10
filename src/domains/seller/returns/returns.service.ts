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

  async findAllReturnBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
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
      .leftJoinAndSelect('return.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('return.sellerId = :sellerId', { sellerId });

    if (query) {
      queryBuilder.andWhere('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
    }

    const [returns, total] = await queryBuilder
      .orderBy('return.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const _return of returns) {
      _return.name = _return.sellerProduct.name;
      _return.color = _return.sellerProductOption.color;
      _return.size = _return.sellerProductOption.size;
      _return.wholesalerName = _return.wholesalerProfile.name;
      _return.wholesalerStoreName = _return.wholesalerProfile.store.name;
      _return.wholesalerStoreRoomNo = _return.wholesalerProfile.roomNo;
      _return.wholesalerMobile = _return.wholesalerProfile.mobile;
     
      delete(_return.status);
      delete(_return.wholesalerId);
      delete(_return.wholesalerProfile);
      delete(_return.wholesalerProductId);
      delete(_return.wholesalerProductOptionId);
      delete(_return.sellerId);
      delete(_return.sellerProductId);
      delete(_return.sellerProductOptionId);
      delete(_return.sellerProductOption);
      delete(_return.sellerProduct);
    }
    
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
