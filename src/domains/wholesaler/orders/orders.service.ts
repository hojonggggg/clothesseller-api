import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between, Brackets, In } from 'typeorm';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/orders/entities/wholesaler-order-history.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
//import { CreateManualOrderingDto } from 'src/domains/seller/orders/dto/create-manual-ordering.dto';
import { CreatePrepaymentDto } from 'src/domains/seller/orders/dto/create-prepayment.dto';
import { WholesalerConfirmOrderDto } from './dto/wholesaler-confirm-order.dto';
import { WholesalerDeliveryDelayOrderDto } from './dto/wholesaler-delivery-delay-order.dto';
import { WholesalerRejectOrderDto } from './dto/wholesaler-reject-order.dto';
import { WholesalerPrepaymentOrderDto } from './dto/wholesaler-prepayment-order.dto';
import { WholesalerCreatePrepaymentDto } from './dto/wholesaler-create-prepayment.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';
import { getToday, getStartAndEndDate } from 'src/commons/shared/functions/date';
import { WholesalerSoldoutOrderDto } from './dto/wholesaler-soldout-order.dto';

@Injectable()
export class WholesalerOrdersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
    @InjectRepository(WholesalerOrderHistory)
    private wholesalerOrderHistoryRepository: Repository<WholesalerOrderHistory>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
    @InjectRepository(WholesalerProfile)
    private wholesalerProfileRepository: Repository<WholesalerProfile>,
  ) {}

  async findAllOrder(wholesalerId: number, date: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('order.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')
      .where('order.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere("DATE(order.createdAt) = :date", { date })
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
      delete(order.prepaymentDate);
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

  async createOrderHistory(wholesalerOrderId: number, action: string, quantity: number) {
    const history = this.wholesalerOrderHistoryRepository.create({
      wholesalerOrderId,
      action,
      quantity
    });

    await this.wholesalerOrderHistoryRepository.save(history);
  }

  async orderConfirm(wholesalerId: number, wholesalerConfirmOrderDto: WholesalerConfirmOrderDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { orders } = wholesalerConfirmOrderDto;
      for (const order of orders) {
        const { id, quantity } = order;
        const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });

        await this.wholesalerOrderRepository.update(
          { id, wholesalerId },
          { 
            quantity: orderItem.quantity - quantity,
            quantityOfDelivery: orderItem.quantityOfDelivery + quantity,
            status: '부분출고'
          }
        );

        const wholesaler = await this.wholesalerProfileRepository.createQueryBuilder('wholesalerProfile')
          .select([
            'wholesalerProfile.store_id AS storeId',
            'wholesalerProfile.room_no AS roomNo'
          ])
          .where('wholesalerProfile.id = :wholesalerId', { wholesalerId })
          .getOne();
          console.log({wholesaler});

        //const newQuantity = orderItem.quantity - quantity;
        await this.createOrderHistory(id, 'confirm', quantity);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async orderPrepayment(wholesalerId: number, wholesalerPrepaymentOrderDto: WholesalerPrepaymentOrderDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { orders } = wholesalerPrepaymentOrderDto;
      for (const order of orders) {
        const { id, quantity, prepaymentDate, deliveryDate } = order;
        const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });

        await this.wholesalerOrderRepository.update(
          { id, wholesalerId },
          { 
            quantity: orderItem.quantity - quantity,
            quantityOfPrepayment: orderItem.quantityOfPrepayment + quantity,
            status: '미송처리',
            isPrepayment: true,
            prepaymentDate,
            deliveryDate
          }
        );

        await this.createOrderHistory(id, 'prepayment', quantity);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async orderReject(wholesalerId: number, wholesalerRejectOrderDto: WholesalerRejectOrderDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { orders } = wholesalerRejectOrderDto;
      for (const order of orders) {
        const { id, quantity, memo } = order;
        //const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });

        await this.wholesalerOrderRepository.update(
          { id, wholesalerId },
          { 
            memo,
            status: '발주불가'
          }
        );

        await this.createOrderHistory(id, 'reject', quantity);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async orderSoldout(wholesalerId: number, wholesalerSoldoutOrderDto: WholesalerSoldoutOrderDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { orders } = wholesalerSoldoutOrderDto;

      for (const order of orders) {
        const { id, memo } = order;
        //const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });

        await this.wholesalerOrderRepository.update(
          { id, wholesalerId }, 
          { 
            memo,
            status: '품절',
            isSoldout: true
           }
        );

        await this.createOrderHistory(id, 'soldout', null);

        const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id } });
        const { wholesalerProductOptionId } = orderItem;
        await this.wholesalerProductOptionRepository.update(
          { id: wholesalerProductOptionId },
          { isSoldout: true }
        );
      }

      /*
      for (const id of ids) {
        await this.wholesalerOrderRepository.update(
          { id, wholesalerId }, 
          { 
            status: '품절',
            isSoldout: true
           }
        );

        const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });
        const quantity = orderItem.quantity;
        await this.createOrderHistory(id, 'soldout', quantity);

        const order = await this.wholesalerOrderRepository.findOne({ where: { id } });
        const { wholesalerProductOptionId } = order;
        await this.wholesalerProductOptionRepository.update(
          { id: wholesalerProductOptionId },
          { isSoldout: true }
        );
      }
      */
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createPrePayment(wholesalerId: number, wholesalerCreatePrepaymentDto: WholesalerCreatePrepaymentDto) {
    const today = getToday();
    const prePayment = this.wholesalerOrderRepository.create({
      wholesalerId,
      ...wholesalerCreatePrepaymentDto,
      orderType: '수동',
      status: '미송등록',
      isPrepayment: true,
      prepaymentDate: today
    });
    await this.wholesalerOrderRepository.save(prePayment);
  }

  async findAllPrePayment(wholesalerId: number, startDate: string, endDate: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('order.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('order.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')
      .where('order.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('order.prepaymentDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('order.isPrepayment = :isPrepayment', { isPrepayment: true });


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
      if (order.status != '출고완료' && order.status != '출고지연') {
        order.status = '미출고';
      }
      order.quantity = order.quantityOfPrepayment;
      delete(order.wholesalerId);
      delete(order.wholesalerProductId);
      delete(order.wholesalerProduct);
      delete(order.wholesalerProductOptionId);
      delete(order.sellerId);
      delete(order.sellerOrderId);
      delete(order.sellerProductId);
      delete(order.sellerProductOptionId);
      delete(order.orderType);
      delete(order.quantityOfDelivery);
      delete(order.quantityOfPrepayment);
      delete(order.quantityTotal);
      delete(order.isDeleted);
      delete(order.isPrepayment);
      delete(order.prepaymentDate);
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

  async setDeliveryStatusOrder(wholesalerId: number, status: string, ids: number[]): Promise<void> {
    await this.wholesalerOrderRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        status
      }
    );
  }

  async setDeliveryDelayOrder(wholesalerId: number, wholesalerDeliveryDelayOrderDto: WholesalerDeliveryDelayOrderDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { orders } = wholesalerDeliveryDelayOrderDto;
      for (const order of orders) {
        const { id, quantity, deliveryDate } = order;
        const orderItem = await this.wholesalerOrderRepository.findOne({ where: { id, wholesalerId } });

        await this.wholesalerOrderRepository.update(
          { id, wholesalerId },
          { 
            status: '출고지연',
            deliveryDate
          }
        );

        await this.createOrderHistory(id, 'delivery-delay', quantity);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



  async findAllPrePaymentOfMonthly(wholesalerId: number, month: string) {
    const { startDate, endDate } = getStartAndEndDate(month);
    
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('order')
      .select([
        'order.id AS id',
        'wholesalerProduct.name AS name',
        'wholesalerProduct.price AS productPrice',
        'wholesalerProductOption.color AS color',
        'wholesalerProductOption.size AS size',
        'wholesalerProductOption.price AS optionPrice',
        'order.quantity AS quantity',
        'order.prepaymentDate AS prepaymentDate',
        'order.deliveryDate AS deliveryDate',
      ])
      .leftJoin('order.wholesalerProduct', 'wholesalerProduct')
      .leftJoin('order.wholesalerProductOption', 'wholesalerProductOption')
      .where('order.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('STR_TO_DATE(order.prepaymentDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
            startDate,
            endDate
          })
          .orWhere('STR_TO_DATE(order.deliveryDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
            startDate,
            endDate
          });
        })
      );

    const rawOrders = await queryBuilder
      .orderBy('order.id', 'DESC')
      .getRawMany();
    
    for (const rawOrder of rawOrders) {
      const { productPrice, optionPrice, quantity } = rawOrder;
      rawOrder.price = formatCurrency((productPrice + optionPrice) * quantity);
      delete(rawOrder.productPrice);
      delete(rawOrder.optionPrice);
      delete(rawOrder.quantity);
    }
    /*
    const orders = rawOrders.reduce((acc, result) => {
      const { sampleId, sampleDate, quantity, returnDate, wholesalerProductName, sellerName } = result;
    
      // 이미 그룹이 존재하는지 확인
      let dateGroup = acc.find(group => group.sampleDate === sampleDate);
      
      if (!dateGroup) {
        // 그룹이 없으면 새로 생성
        dateGroup = { sampleDate, samples: [] };
        acc.push(dateGroup);
      }
    
      // 샘플 추가
      dateGroup.samples.push({ id: sampleId, name: wholesalerProductName, quantity, sellerName, sampleDate, returnDate });
    
      return acc;
    }, []);
    */
    return rawOrders;
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

      console.log({pickups});

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
  /*
  async createManualOrdering(sellerId: number, createManualOrderingDto: CreateManualOrderingDto) {
    const ordering = this.wholesalerOrderRepository.create({
      ...createManualOrderingDto,
      sellerId,
      quantityTotal: createManualOrderingDto.quantity,
      orderType: '수동',
      //status: '발주요청',
    });
    return await this.wholesalerOrderRepository.save(ordering);
  }
  */
 /*
  async createPrepayment(sellerId: number, createPrepaymentDto: CreatePrepaymentDto) {
    const { wholesalerId, wholesalerProductId, wholesalerProductOptionId, quantity } = createPrepaymentDto;
    
    const prepayment = this.wholesalerOrderRepository.create({
      sellerId,
      orderType: 'MANUAL',
      quantity,
      quantityTotal: quantity,

      status: '미송요청',
      prepaymentDate: getToday(),
      isPrepayment: true
    });
    return await this.wholesalerOrderRepository.save(prepayment);
  }
  */
  async createPrePaymentFromWholesaler(wholesalerId: number, wholesalerCreatePrepaymentDto: WholesalerCreatePrepaymentDto) {

    const { options } = wholesalerCreatePrepaymentDto;

    for (const option of options) {

      const { wholesalerProductOptionId, quantity } = option;

      const prepayment = this.wholesalerOrderRepository.create({
        ...wholesalerCreatePrepaymentDto,
        wholesalerId,
        wholesalerProductOptionId,
        quantity: 0,
        quantityTotal: quantity,
        quantityOfDelivery: 0,
        quantityOfPrepayment: quantity,
        orderType: '수동',
        status: '미송요청',
        prepaymentDate: getToday(),
        isPrepayment: true
      });

      await this.wholesalerOrderRepository.save(prepayment);
    }
    
    
    
  }
}

