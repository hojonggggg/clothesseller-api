import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { _getStartAndEndDate } from 'src/commons/shared/functions/date';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class SellerAccountBooksService {
  constructor(
    //private readonly dataSource: DataSource,

    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
  ) {}

  async findAllAccountBookBySellerId(sellerId: number, month: string, wholesalerName: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    let { startDate, endDate } = _getStartAndEndDate(month);
    startDate = startDate + " 00:00:00";
    endDate = endDate + " 23:59:59";

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'DATE_FORMAT(CONVERT_TZ(order.createdAt, "+00:00", "+09:00"), "%Y-%m-%d") AS orderDate',
        'sellerProduct.name AS name',
        'SUM(sellerProduct.wholesalerProductPrice) AS totalPrice',
      ])
      .leftJoin('order.sellerProduct', 'sellerProduct')
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.status = :status', { status: '발주승인' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      //.groupBy('orderDate, sellerProduct.name') // 날짜와 상품 이름으로 그룹화
      //.orderBy('orderDate', 'ASC'); // 날짜 오름차순 정렬
    

    if (wholesalerName) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${wholesalerName}%` });
        })
      );
    }
    
    const rawOrders = await queryBuilder
      .groupBy('orderDate, sellerProduct.name')
      .orderBy('order.id', 'ASC')
      .getRawMany();
    
    for (const rawOrder of rawOrders) {
      rawOrder.totalPrice = formatCurrency(rawOrder.totalPrice);
    }

    const totalPriceQuery = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select('SUM(sellerProduct.wholesalerProductPrice) AS totalAmount')
      .leftJoin('order.sellerProduct', 'sellerProduct')
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.status = :status', { status: '발주승인' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });

    if (wholesalerName) {
      totalPriceQuery.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${wholesalerName}%` });
        })
      );
    }

    const totalPriceResult = await totalPriceQuery.getRawOne();

    const totalAmount = totalPriceResult.totalAmount || 0;
    const tenPercentAmount = totalAmount * 0.10;

    return {
      orders: rawOrders,
      totalAmount: formatCurrency(totalAmount),
      tenPercentAmount: formatCurrency(tenPercentAmount),
    };
    /*
    const [orders, total] = await queryBuilder
    .orderBy('order.id', 'DESC')
    .take(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .getManyAndCount();
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
    */
  }

}