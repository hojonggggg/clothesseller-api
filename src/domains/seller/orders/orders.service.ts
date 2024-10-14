import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { getStartAndEndDate } from 'src/commons/shared/functions/date';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';
import { getToday } from 'src/commons/shared/functions/date';

@Injectable()
export class SellerOrdersService {
  constructor(
    @InjectRepository(SellerOrder)
    private sellerOrderRepository: Repository<SellerOrder>,
    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
  ) {}

  async summarySellerOrder(sellerId: number) {
    const result = {
      newOrder: 15,
      matchingPending: 7,
      matchingCompleted: 23,
      orderPending: 7,
      orderCompleted: 13
    };
    return result;
  }

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

  async deleteSellerOrder(sellerId: number, ids: number[]): Promise<void> {
    await this.sellerOrderRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        status: '삭제',
        isDeleted: true
      }
    );
  }

  async findAllSellerOrderWaitBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.name = order.sellerProduct.name;
      order.color = order.sellerProductOption.color;
      order.size = order.sellerProductOption.size;
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;
      
      delete(order.sellerId);
      delete(order.mallId);
      delete(order.sellerProductId);
      delete(order.sellerProduct);
      delete(order.sellerProductOptionId);
      delete(order.sellerProductOption);
      delete(order.wholesalerId);
      delete(order.wholesalerProfile);
      delete(order.wholesalerProductId);
      delete(order.wholesalerProductOptionId);
      
    }
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.orderType = :orderType', { orderType })
      .andWhere('order.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }
    /*
    const [orders, total] = await this.wholesalerOrderRepository.findAndCount({
      where: { sellerId, orderType },
      relations: ['sellerProduct', 'sellerProductOption', 'wholesalerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    */

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.sellerProductName = order.sellerProduct.name;
      order.sellerProductColor = order.sellerProductOption.color;
      order.sellerProductSize = order.sellerProductOption.size;
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;

      delete(order.orderType);
      delete(order.memo);
      delete(order.prePaymentDate);
      delete(order.deliveryDate);
      delete(order.createdAt);
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
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async deleteWholesalerOrder(sellerId: number, ids: number[]): Promise<void> {
    await this.wholesalerOrderRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        status: '삭제',
        isDeleted: true
      }
    );
  }

  async prepaymentWholesalerOrder(sellerId: number, ids: number[]): Promise<void> {
    const today = getToday();
    await this.wholesalerOrderRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        status: '미송요청',
        isPrepayment: true,
        prePaymentDate: today
      }
    );
  }

  async findAllPrePaymentOfWholesalerOrderBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sellerProduct.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('order.prePaymentDate = :date', { date: query });
        })
      );
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.sellerProductName = order.sellerProduct.name;
      order.sellerProductColor = order.sellerProductOption.color;
      order.sellerProductSize = order.sellerProductOption.size;
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;
      
      delete(order.orderType);
      delete(order.memo);
      delete(order.status);
      delete(order.createdAt);
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
    }
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllPrePaymentOfMonthlyBySellerId(sellerId: number, month: string) {
    const { startDate, endDate } = getStartAndEndDate(month);
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS orderId',
        'order.quantity AS quantity',
        'order.prePaymentDate AS prePaymentDate',
        'order.deliveryDate AS deliveryDate',
        'sellerProduct.name AS sellerProductName',
      ])
      .leftJoin('order.sellerProduct', 'sellerProduct')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true })
      .andWhere('STR_TO_DATE(order.prePaymentDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
        startDate,
        endDate
      });

    const rawOrders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();
    
    const orders = rawOrders.reduce((acc, result) => {
      const { orderId, price, prePaymentDate, sellerProductName, deliveryDate } = result;
    
      // 이미 그룹이 존재하는지 확인
      let dateGroup = acc.find(group => group.prePaymentDate === prePaymentDate);
      
      if (!dateGroup) {
        // 그룹이 없으면 새로 생성
        dateGroup = { prePaymentDate, orders: [] };
        acc.push(dateGroup);
      }
    
      // 샘플 추가
      dateGroup.orders.push({ id: orderId, name: sellerProductName, price, prePaymentDate, deliveryDate });
    
      return acc;
    }, []);
    
    return orders;
  }

  async findAllPrePaymentOfDailyBySellerId(sellerId: number, day: string) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS id',
        'order.quantity AS quantity',
        'order.prePaymentDate AS prePaymentDate',
        'order.deliveryDate AS deliveryDate',
        'sellerProduct.name AS name',
        'sellerProduct.wholesalerProductPrice AS wholesalerProductPrice',
        'sellerProductOption.color AS color',
        'sellerProductOption.size AS size',
        'wholesalerProfile.name AS wholesalerName'
      ])
      .leftJoin('order.sellerProduct', 'sellerProduct')
      .leftJoin('order.sellerProductOption', 'sellerProductOption')
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true })
      .andWhere('order.prePaymentDate = :day', { day });

    const orders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();

    for (const order of orders) {
      order.price = formatCurrency((order.quantity) * (order.wholesalerProductPrice));

      delete(order.quantity);
      delete(order.wholesalerProductPrice);
    }
    return orders;
  }
}
