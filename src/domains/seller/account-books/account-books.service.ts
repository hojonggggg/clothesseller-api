import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { _getStartAndEndDate } from 'src/commons/shared/functions/date';

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
        'sellerProduct.name AS name',
        'sellerProduct.wholesalerProductPrice AS price',
        'order.createdAt AS createdAt'
      ])
      .leftJoin('order.sellerProduct', 'sellerProduct')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.status = :status', { status: '발주승인' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    
    const rawOrders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();

    return rawOrders;
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