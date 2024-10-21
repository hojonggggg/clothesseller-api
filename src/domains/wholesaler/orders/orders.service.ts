import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between, Brackets, In } from 'typeorm';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { CreateManualOrderingDto } from 'src/domains/seller/orders/dto/create-manual-ordering.dto';
import { CreatePrepaymentDto } from 'src/domains/seller/orders/dto/create-prepayent.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { getToday } from 'src/commons/shared/functions/date';

@Injectable()
export class WholesalerOrdersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
  ) {}

  async findAllOrder(wholesalerId: number, date: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const startOfDay = new Date(date);
    startOfDay.setHours(startOfDay.getHours() + 9);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    endOfDay.setHours(endOfDay.getHours() + 9);

    const { pageNumber, pageSize } = paginationQueryDto;
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('order.sellerProfile', 'sellerProfile')
      .where('order.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('order.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false });


    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const order of orders) {
      order.name = order.wholesalerProduct.name;
      order.color = order.wholesalerProductOption.color;
      order.size = order.wholesalerProductOption.size;
      order.sellerName = order.sellerProfile.name;
      order.sellerMobile = order.sellerProfile.mobile;
      if (order.sellerProfile.deliveryman) {
        order.deliverymanMobile = order.sellerProfile.deliveryman.mobile;
      } else {
        order.deliverymanMobile = null;
      }
      delete(order.wholesalerId);
      delete(order.wholesalerProductId);
      delete(order.wholesalerProduct);
      delete(order.wholesalerProductOptionId);
      delete(order.sellerId);
      delete(order.sellerOrderId);
      delete(order.sellerProductId);
      delete(order.sellerProductOptionId);
      delete(order.orderType);
      delete(order.isDeleted);
      delete(order.isPrepayment);
      delete(order.prePaymentDate);
      delete(order.deliveryDate);
      delete(order.createdAt);
      delete(order.wholesalerProductOption);
      delete(order.sellerProfile);
    }
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async soldoutOrder(wholesalerId: number, ids: number[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      /*
      await this.wholesalerOrderRepository.update(
        {
          id: In(ids),
          wholesalerId
        }, {
          isSoldout: true
        }
      );
      */
      for (const id of ids) {
        await this.wholesalerOrderRepository.update(
          { id, wholesalerId }, 
          { isSoldout: true }
        );

        const order = await this.wholesalerOrderRepository.findOne({ where: { id } });
        const { wholesalerProductOptionId } = order;
        await this.wholesalerProductOptionRepository.update(
          { id: wholesalerProductOptionId },
          { isSoldout: true }
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  ////////////
  async findAllOrderByWholesalerId(wholesalerId: number, date: string, paginationQuery: PaginationQueryDto) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { pageNumber, pageSize } = paginationQuery;
    const [orders, total] = await this.wholesalerOrderRepository.findAndCount({
      where: { wholesalerId, createdAt: Between(startOfDay, endOfDay)  },
      relations: ['productOption', 'productOption.wholesalerProduct', 'sellerProfile', 'sellerProfile.deliveryman'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    
    for (const order of orders) {
      order.name = order.wholesalerProductOption.wholesalerProduct.name;
      order.color = order.wholesalerProductOption.color;
      order.size = order.wholesalerProductOption.size;
      order.quantity = order.wholesalerProductOption.quantity;
      order.sellerName = order.sellerProfile.name;
      order.sellerMobile = order.sellerProfile.mobile;
      if (order.sellerProfile.deliveryman) {
        order.deliverymanMobile = order.sellerProfile.deliveryman.mobile;
      } else {
        order.deliverymanMobile = null;
      }
      delete(order.wholesalerId);
      delete(order.wholesalerProductOptionId);
      delete(order.wholesalerProductOption);
      delete(order.sellerId);
      delete(order.sellerProfile);
    }
    
    return {
      list: orders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }


  //삭제하지 말 것
  async findAllPickupOfFromWholesalerBySellerId(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const _queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS orderId',
        'wholesalerProfile.storeId AS wholesalerStoreId',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.id AS wholesalerId',
        'wholesalerProfile.name AS wholesalerName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'DATE_FORMAT(order.createdAt, "%y/%m/%d/%H:%i") AS orderDate',
        'IF(order.status = "픽업", "O", "X") AS isPickup'
      ])
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('wholesalerProfile.store', 'wholesalerStore')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false })

    if (query) {
      _queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }
    
    const pickups = await _queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getRawMany();

    /*
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS orderId',
        'wholesalerProfile.id AS wholesalerId',
        'wholesalerProfile.storeId AS wholesalerStoreId',
        'wholesalerProfile.name AS wholesalerName',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'order.status AS status',
        'DATE_FORMAT(order.createdAt, "%y/%m/%d/%H:%i") AS orderDate',
      ])
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('wholesalerProfile.store', 'wholesalerStore')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.status != :status', { status: '미송' });
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }
    
    const pickups = await queryBuilder
      .orderBy('order.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getRawMany();
    */
    const totalQuery = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS orderId',
        'wholesalerProfile.storeId AS wholesalerStoreId',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.id AS wholesalerId',
        'wholesalerProfile.name AS wholesalerName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'DATE_FORMAT(order.createdAt, "%y/%m/%d/%H:%i") AS orderDate',
        'IF(order.status = "픽업", "O", "X") AS isPickup'
      ])
      .leftJoin('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('wholesalerProfile.store', 'wholesalerStore')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: false })

    if (query) {
      totalQuery.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }
    
    //const total = await totalQuery.getCount();
    let totalWholesalerIds = new Set();

    const groupedPickups = pickups.reduce((acc, current) => {
      const storeId = current.wholesalerStoreId;
      const wholesalerId = current.wholesalerId;

      // 첫 번째 그룹화 (wholesalerStoreId)
      if (!acc[storeId]) {
        acc[storeId] = {
          wholesalerStoreId: storeId,
          wholesalerStoreName: current.wholesalerStoreName,
          wholesalers: []
        };
      }

      // 두 번째 그룹화 (wholesalerId)
      const wholesalerGroup = acc[storeId].wholesalers.find(w => w.wholesalerId === wholesalerId);
      if (!wholesalerGroup) {
        acc[storeId].wholesalers.push({
          wholesalerId: wholesalerId,
          wholesalerName: current.wholesalerName,
          wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
          //orders: []
          orderDate: '24/10/08/22:00',
          isPickup: 'X'
        });
      }

      /******
      const groupIndex = acc[storeId].wholesalers.findIndex(w => w.wholesalerId === wholesalerId);
      acc[storeId].wholesalers[groupIndex].orders.push({
        orderDate: current.orderDate,
        totalPrice: current.totalPrice,
        isPickup: current.isPickup,
      });
      ********/


      /*
      if (!acc[storeId].wholesalers[wholesalerId]) {
        acc[storeId].wholesalers[wholesalerId] = {
          wholesalerId,
          wholesalerName: current.wholesalerName,
          orders: [],  // 주문 목록을 담을 배열 생성
        };
      }
      */
      /*
      const isPickup = (current.status === '픽업') ? 'O' : 'X';
      acc[storeId].orders.push({
        id: current.orderId,
        wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
        wholesalerName: current.wholesalerName,
        orderDate: current.orderDate,
        isPickup
      });
      */
      /*
      const isPickup = current.status === '픽업' ? 'O' : 'X';

      acc[storeId].wholesalers[wholesalerId].orders.push({
        id: current.orderId,
        wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
        orderDate: current.orderDate,
        isPickup,
      });
      */
      totalWholesalerIds.add(wholesalerId);

      return acc;
    }, {});
  
    const result = Object.values(groupedPickups);
    const total = totalWholesalerIds.size;

    //return result;
    return {
      list: result,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async createManualOrdering(sellerId: number, createManualOrderingDto: CreateManualOrderingDto) {
    const ordering = this.wholesalerOrderRepository.create({
      ...createManualOrderingDto,
      sellerId,
      orderType: '수동',
      status: '발주요청',
    });
    return await this.wholesalerOrderRepository.save(ordering);
  }

  async createPrepayment(sellerId: number, createPrepaymentDto: CreatePrepaymentDto) {
    const prepayment = this.wholesalerOrderRepository.create({
      ...createPrepaymentDto,
      sellerId,
      orderType: '수동',
      status: '미송요청',
      prePaymentDate: getToday(),
      isPrepayment: true
    });
    return await this.wholesalerOrderRepository.save(prepayment);
  }
}

