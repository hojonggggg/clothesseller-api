import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class SellerOrdersService {
  constructor(
    @InjectRepository(SellerOrder)
    private sellerOrderRepository: Repository<SellerOrder>,
    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
  ) {}

  async findAllSellerOrderBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.mall', 'mall')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .where('order.sellerId = :sellerId', { sellerId });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }
    /*
    const [orders, total] = await this.sellerOrderRepository.findAndCount({
      where: { sellerId },
      relations: ['sellerProduct', 'sellerProductOption', 'wholesalerProduct', 'mall'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.name = order.sellerProduct.name;
      order.color = order.sellerProductOption.color;
      order.size = order.sellerProductOption.size;
      order.wholesalerProductName = order.wholesalerProduct.name;
      order.mallName = order.mall.name;
      
      delete(order.sellerId);
      delete(order.sellerProductId);
      delete(order.sellerProduct);
      delete(order.sellerProductOptionId);
      delete(order.sellerProductOption);
      delete(order.wholesalerId);
      delete(order.wholesalerProductId);
      delete(order.wholesalerProductOptionId);
      delete(order.wholesalerProduct);
      delete(order.mallId);
      delete(order.mall);
      
    }
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllWholesalerOrderBySellerId(sellerId: number, orderType: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    const [orders, total] = await this.wholesalerOrderRepository.findAndCount({
      where: { sellerId, orderType },
      relations: ['sellerProduct', 'sellerProductOption', 'wholesalerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    
    for (const order of orders) {
      order.sellerProductName = order.sellerProduct.name;
      order.sellerProductColor = order.sellerProductOption.color;
      order.sellerProductSize = order.sellerProductOption.size;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;

      delete(order.orderType);
      delete(order.sellerOrderId);
      delete(order.sellerId);
      delete(order.sellerProductId);
      delete(order.sellerProduct);
      delete(order.sellerProductOptionId);
      delete(order.sellerProductOption);
      delete(order.wholesalerId);
      delete(order.wholesalerProfile);
      delete(order.wholesalerProductId);
      delete(order.wholesalerProductOptionId);
      delete(order.wholesalerProduct);
      //delete(order.mallId);
      //delete(order.mall);
    }
    
    return {
      data: orders,
      meta: {
        total,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
