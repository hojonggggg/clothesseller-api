import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
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
  /*
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
  */
  /*
  async _findAllSellerOrderBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
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
    /*
    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.name = order.sellerProduct.name;
      order.color = order.sellerProductOption.color;
      order.size = order.sellerProductOption.size;
      if (order.wholesalerProduct) {
        order.wholesalerProductName = order.wholesalerProduct.name;
      } else {
        order.status = '매칭필요';
      }
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
  */
 /*
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
  */
  /*
  async __findAllSellerOrderWaitBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.wholesalerId IS NOT NULL');

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
  */
 /*
  async findAllWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
      .select([
        'sellerProduct.name AS name',
        'sellerProductOption.color AS color',
        'sellerProductOption.size AS size',
        'SUM(wholesalerOrder.quantity) AS quantity',
        'wholesalerProfile.name AS wholesalerName',
        'store.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'wholesalerProfile.mobile AS wholesalerMobile'
      ])
      .leftJoin('wholesalerOrder.sellerProduct', 'sellerProduct')
      .leftJoin('wholesalerOrder.sellerProductOption', 'sellerProductOption')
      .leftJoin('wholesalerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.orderType = :orderType', { orderType })
      .andWhere('order.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false })
      .groupBy("wholesalerOrder.wholesalerProductOptionId");

    if (query) {
      queryBuilder.andWhere('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
    }
    
    // 전체 데이터 가져오기
    const allData = await queryBuilder.getRawMany();

    // JavaScript로 페이징 처리
    const total = allData.length;
    const data = allData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return {
      list: data,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
  */

  async _findAllAutoWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQuery: PaginationQueryDto) {
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
      if (order.sellerProduct) {
        order.sellerProductName = order.sellerProduct.name;
      }
      if (order.sellerProductOption) {    
        order.sellerProductColor = order.sellerProductOption.color;
        order.sellerProductSize = order.sellerProductOption.size;
      }
  
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;
      order.orderDate = order.createdAt.toString().substring(0, 10);

      delete(order.orderType);
      delete(order.memo);
      delete(order.prepaymentDate);
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

  async findAllAutoWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wo')
      .select([
        'wo.id AS id',
        'sp.name AS sellerProductName',
        'spo.color AS sellerProductColor',
        'spo.size AS sellerProductSize',
        'SUM(wo.quantity) AS quantity',
        'wp.name AS wholesalerName',
        's.name AS wholesalerStoreName',
        'wp.roomNo AS wholesalerStoreRoomNo',
        'wp.mobile AS wholesalerMobile',
        'DATE_FORMAT(wo.createdAt, "%Y.%m.%d") AS orderDate',
        'wo.memo AS memo'
      ])
      .leftJoin('wo.sellerProduct', 'sp')
      .leftJoin('wo.sellerProductOption', 'spo')
      .leftJoin('wo.wholesalerProfile', 'wp')
      .leftJoin('wp.store', 's')
      .where('wo.sellerId = :sellerId', { sellerId })
      .andWhere('wo.orderType = :orderType', { orderType })
      .andWhere('wo.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('wo.isPrepayment = :isPrepayment', { isPrepayment: false })
      .groupBy('DATE_FORMAT(wo.createdAt, "%Y.%m.%d")')
      .addGroupBy('wo.sellerProductOptionId');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sp.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const allData = await queryBuilder
      .orderBy('DATE_FORMAT(wo.createdAt, "%Y.%m.%d")', 'DESC')
      .getRawMany();

    const total = allData.length;
    const data = allData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return {
      list: data,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async remove_findAllManualWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wo')
      .select([
        'wo.id AS id',
        'wp1.name AS wholesalerProductName',
        'wpo.color AS wholesalerProductColor',
        'wpo.size AS wholesalerProductSize',
        'SUM(wo.quantity) AS quantity',
        'wp2.name AS wholesalerName',
        's.name AS wholesalerStoreName',
        'wp2.roomNo AS wholesalerStoreRoomNo',
        'wp2.mobile AS wholesalerMobile',
        'DATE_FORMAT(wo.createdAt, "%Y.%m.%d") AS orderDate',
        'wo.memo AS memo',
        'wo.sellerOrderId AS sellerOrderId',
        'wo.status AS status'
      ])
      .leftJoin('wo.wholesalerProduct', 'wp1')
      .leftJoin('wo.wholesalerProductOption', 'wpo')
      .leftJoin('wo.wholesalerProfile', 'wp2')
      .leftJoin('wp2.store', 's')
      .where('wo.sellerId = :sellerId', { sellerId })
      .andWhere('wo.orderType = :orderType', { orderType })
      .andWhere('wo.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('wo.isPrepayment = :isPrepayment', { isPrepayment: false })
      .andWhere('wo.isOrdering = :isOrdering', { isOrdering: false })
      //.groupBy('DATE_FORMAT(wo.createdAt, "%Y.%m.%d")')
      //.addGroupBy('wo.wholesalerProductOptionId');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wp1.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const allData = await queryBuilder
      //.orderBy('DATE_FORMAT(wo.createdAt, "%Y.%m.%d")', 'DESC')
      .orderBy('wo.id', 'DESC')
      .getRawMany();

    const filteredData = allData.filter(item => 
      Object.values(item).some(value => value !== null && value !== undefined)
    );

    const total = filteredData.length;
    const data = filteredData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return {
      list: filteredData,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async _findAllManualWholesalerOrderBySellerId(sellerId: number, orderType: string, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.orderType = :orderType', { orderType })
      .andWhere('order.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
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
      if (order.wholesalerProduct) {
        order.wholesalerProductName = order.wholesalerProduct.name;
      }
      if (order.wholesalerProductOption) {    
        order.wholesalerProductColor = order.wholesalerProductOption.color;
        order.wholesalerProductSize = order.wholesalerProductOption.size;
      }
  
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;

      delete(order.orderType);
      //delete(order.memo);
      delete(order.prepaymentDate);
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
      delete(order.wholesalerProductOption);
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
        prepaymentDate: today
      }
    );
  }

  async findAllPrePaymentOfWholesalerOrderBySellerId(sellerId: number, startDate: string, endDate: string, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.prepaymentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
            //.orWhere('order.prepaymentDate = :date', { date: query });
        })
      );
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.sellerProductName = order.wholesalerProduct?.name ?? "수동발주 상품";
      order.sellerProductColor = order.wholesalerProductOption?.color ?? null;
      order.sellerProductSize = order.wholesalerProductOption?.size ?? null;
      order.wholesalerName = order.wholesalerProfile.name;
      order.wholesalerStoreName = order.wholesalerProfile.store.name;
      order.wholesalerStoreRoomNo = order.wholesalerProfile.roomNo;
      order.wholesalerMobile = order.wholesalerProfile.mobile;
      order.prePaymentDate = order.prepaymentDate;
      order.quantity = order.quantityOfPrepayment;


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
      delete(order.wholesalerProduct);
      delete(order.wholesalerProductOptionId);
      delete(order.wholesalerProductOption);
      delete(order.quantityTotal);
      delete(order.quantityOfDelivery);
      delete(order.quantityOfPrepayment);
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
        'order.prepaymentDate AS prePaymentDate',
        'order.deliveryDate AS deliveryDate',
        'wholesalerProduct.name AS sellerProductName',
      ])
      .leftJoin('order.wholesalerProduct', 'wholesalerProduct')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true })
      .andWhere('STR_TO_DATE(order.prepaymentDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
        startDate,
        endDate
      });

    const rawOrders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();
    
    const orders = rawOrders.reduce((acc, result) => {
      console.log({result});
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
        'order.prepaymentDate AS prePaymentDate',
        'order.deliveryDate AS deliveryDate',
        'wholesalerProduct.name AS name',
        'wholesalerProduct.price AS price',
        'wholesalerProductOption.color AS color',
        'wholesalerProductOption.size AS size',
        'wholesalerProfile.name AS wholesalerName'
      ])
      //.leftJoin('order.sellerProduct', 'sellerProduct')
      //.leftJoin('order.sellerProductOption', 'sellerProductOption')
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoin('order.wholesalerProductOption', 'wholesalerProductOption')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true })
      .andWhere('order.prepaymentDate = :day', { day });

    const orders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();

    for (const order of orders) {
      //order.price = formatCurrency((order.quantity) * (order.wholesalerProductPrice));
      order.price = formatCurrency((order.quantity) * (order.price))

      delete(order.quantity);
      delete(order.wholesalerProductPrice);
    }
    return orders;
  }
}