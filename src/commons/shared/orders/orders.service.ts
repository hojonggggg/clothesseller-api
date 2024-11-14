import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { WholesalerOrder } from '../orders/entities/wholesaler-order.entity';
import { SellerOrder } from './entities/seller-order.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { getStartAndEndOfToday } from '../functions/date';
import { formatCurrency, formatHyphenDay } from '../functions/format';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
    @InjectRepository(SellerOrder)
    private sellerOrderRepository: Repository<SellerOrder>,
  ) {}

  async findAllWholesalerOrderForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wholesalerOrder')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProductOption', 'wholesalerProductOption')
      .where('wholesalerOrder.isDeleted = 0')
      .andWhere('wholesalerOrder.isPrepayment = 0');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` })
            .orWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [wholesalerOrders, total] = await queryBuilder
      .orderBy('wholesalerOrder.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const wholesalerOrder of wholesalerOrders) {
      const { wholesalerProfile, sellerProfile, wholesalerProduct, wholesalerProductOption } = wholesalerOrder;
      wholesalerOrder.wholesalerName = wholesalerProfile.name;
      wholesalerOrder.sellerName = sellerProfile.name;
      wholesalerOrder.productName = wholesalerProduct.name;
      wholesalerOrder.color = wholesalerProductOption.color;
      wholesalerOrder.size = wholesalerProductOption.size;

      delete(wholesalerOrder.wholesalerId);
      delete(wholesalerOrder.wholesalerProfile);
      delete(wholesalerOrder.orderType);
      delete(wholesalerOrder.sellerId);
      delete(wholesalerOrder.sellerProfile);
      delete(wholesalerOrder.wholesalerProduct);
      delete(wholesalerOrder.wholesalerProductId);
      delete(wholesalerOrder.wholesalerProductOptionId);
      delete(wholesalerOrder.wholesalerProductOption);
      delete(wholesalerOrder.sellerOrderId);
      delete(wholesalerOrder.sellerProductId);
      delete(wholesalerOrder.sellerProductOptionId);
      delete(wholesalerOrder.quantityTotal);
      delete(wholesalerOrder.quantityOfDelivery);
      delete(wholesalerOrder.quantityOfPrepayment);
      delete(wholesalerOrder.isDeleted);
      delete(wholesalerOrder.isSoldout);
      delete(wholesalerOrder.isPrepayment);
      delete(wholesalerOrder.prepaymentDate);
      delete(wholesalerOrder.deliveryDate);
      delete(wholesalerOrder.status);
      delete(wholesalerOrder.createdAt);
    }

    return {
      list: wholesalerOrders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findOneWholesalerOrderForAdmin(orderId: number) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wholesalerOrder')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('wholesalerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProductOption', 'wholesalerProductOption')
      .where('wholesalerOrder.id = :orderId', { orderId })
      .andWhere('wholesalerOrder.isDeleted = 0')
      .andWhere('wholesalerOrder.isPrepayment = 0');

    const wholesalerOrder = await queryBuilder.getOne();
    const { wholesalerProfile, sellerProfile, wholesalerProduct, wholesalerProductOption } = wholesalerOrder;
    const { address1, address2 } = sellerProfile;

    wholesalerOrder.wholesalerProfile.wholesalerId = wholesalerProfile.userId;
    wholesalerOrder.wholesalerProfile.storeName = wholesalerProfile.store.name;
    wholesalerOrder.sellerProfile.sellerId = sellerProfile.userId;
    wholesalerOrder.sellerProfile.address = address1 + " " + address2;
    wholesalerOrder.wholesalerProduct.productId = wholesalerProduct.id;
    wholesalerOrder.wholesalerProduct.color = wholesalerProductOption.color;
    wholesalerOrder.wholesalerProduct.size = wholesalerProductOption.size;

    delete(wholesalerOrder.wholesalerId);
    delete(wholesalerOrder.wholesalerProfile.userId);
    delete(wholesalerOrder.wholesalerProfile.storeId);
    delete(wholesalerOrder.wholesalerProfile.store);
    delete(wholesalerOrder.orderType);
    delete(wholesalerOrder.sellerId);
    delete(wholesalerOrder.sellerProfile.userId);
    delete(wholesalerOrder.sellerProfile.address1);
    delete(wholesalerOrder.sellerProfile.address2);
    delete(wholesalerOrder.wholesalerProductId);
    delete(wholesalerOrder.wholesalerProduct.id);
    delete(wholesalerOrder.wholesalerProduct.price);
    delete(wholesalerOrder.wholesalerProductOptionId);
    delete(wholesalerOrder.wholesalerProductOption);
    delete(wholesalerOrder.sellerOrderId);
    delete(wholesalerOrder.sellerProductId);
    delete(wholesalerOrder.sellerProductOptionId);
    delete(wholesalerOrder.quantityTotal);
    delete(wholesalerOrder.quantityOfDelivery);
    delete(wholesalerOrder.quantityOfPrepayment);
    delete(wholesalerOrder.isDeleted);
    delete(wholesalerOrder.isSoldout);
    delete(wholesalerOrder.isPrepayment);
    delete(wholesalerOrder.prepaymentDate);
    delete(wholesalerOrder.deliveryDate);
    delete(wholesalerOrder.status);
    delete(wholesalerOrder.createdAt);

    return wholesalerOrder;
  }

  async _wholesalerOrderTotalCount(startDate: string, endDate: string) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
      .select([
        'SUM(wholesalerOrder.quantityTotal) AS quantity'
      ])
      .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });
    
    const result = await queryBuilder.getRawOne();
    return Number(result.quantity);
  }

  async _wholesalerOrderTotalPrice(startDate: string, endDate: string) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
      .select([
        'SUM(wholesalerOrder.quantityTotal * wholesalerProduct.price) AS price'
      ])
      .leftJoin('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });
    
    const result = await queryBuilder.getRawOne();
    return formatCurrency(Number(result.price));
  }

  async _wholesalerOrderTotalProductCount(startDate: string, endDate: string) {
    const queryBuilder = this.wholesalerOrderRepository
      .createQueryBuilder("wholesalerOrder")
      .select([
        'COUNT(DISTINCT wholesalerOrder.wholesalerProductId) AS count'
      ])
      .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _wholesalerOrderTotalProductOptionCount(startDate: string, endDate: string) {
    const queryBuilder = this.wholesalerOrderRepository
      .createQueryBuilder("wholesalerOrder")
      .select([
        'COUNT(DISTINCT wholesalerOrder.wholesalerProductOptionId) AS count'
      ])
      .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async wholesalerOrderStatistics(startDate: string, endDate: string) {
    const formatStartDay = formatHyphenDay(startDate);
    const formatEndDay = formatHyphenDay(endDate);

    const totalCount = await this._wholesalerOrderTotalCount(formatStartDay, formatEndDay);
    const totalPrice = await this._wholesalerOrderTotalPrice(formatStartDay, formatEndDay);
    const totalProductCount = await this._wholesalerOrderTotalProductCount(formatStartDay, formatEndDay);
    const totalProductOptionCount = await this._wholesalerOrderTotalProductOptionCount(formatStartDay, formatEndDay);

    return {
      totalCount,
      totalPrice,
      totalProductCount,
      totalProductOptionCount
    }
  }

  async wholesalerOrderVolumeByProduct(startDate: string, endDate: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const formatStartDay = formatHyphenDay(startDate);
    const formatEndDay = formatHyphenDay(endDate);

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
      .select([
        'wholesalerOrder.wholesalerProductOptionId AS optionId',
        'wholesalerProduct.name AS name',
        'wholesalerProductOption.color AS color',
        'wholesalerProductOption.size AS size',
        'SUM(wholesalerOrder.quantityTotal) AS quantity'
      ])
      .leftJoin('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .leftJoin('wholesalerOrder.wholesalerProductOption', 'wholesalerProductOption')
      .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate: formatStartDay, endDate: formatEndDay })
      .groupBy("wholesalerOrder.wholesalerProductOptionId")
      .orderBy("quantity", "DESC");

    // query가 존재하면 조건 추가
    if (query) {
      queryBuilder.andWhere('wholesalerProduct.name LIKE :query', { query: `%${query}%` });
    }
    
    // 전체 데이터 가져오기
    const allVolumes = await queryBuilder.getRawMany();

    // JavaScript로 페이징 처리
    const total = allVolumes.length;
    const volumes = allVolumes.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    for (const volume of volumes) {
      //delete(volume)
    }

    return {
      list: volumes,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async wholesalerOrderVolumeByDaily() {
    // 오늘 날짜 기준으로 7일전 날짜 계산
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 오늘 포함 7일이므로 6일 전으로 설정

    const formatToday = formatHyphenDay(today.toISOString().split('T')[0]);
    const formatSevenDaysAgo = formatHyphenDay(sevenDaysAgo.toISOString().split('T')[0]);

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
     .select([
       'DATE(wholesalerOrder.createdAt) AS orderDate',
       'SUM(wholesalerOrder.quantityTotal) AS quantity'
     ])
     .where("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
       { startDate: formatSevenDaysAgo, endDate: formatToday })
     .groupBy("orderDate")
     .orderBy("orderDate", "DESC");
   
    const results = await queryBuilder.getRawMany();

    // 날짜가 없는 경우도 0으로 채워서 반환하기 위한 처리
    const filledResults = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatHyphenDay(date.toISOString().split('T')[0]).substring(5);
      
      const existingData = results.find(r => r.orderDate === formattedDate);
      filledResults.push({
        orderDate: formattedDate,
        quantity: existingData ? Number(existingData.quantity) : 0
      });
    }

    /*
    return {
      list: filledResults,
      total: filledResults.reduce((sum, item) => sum + item.quantity, 0)
    };
    */
    return filledResults.reverse();
  }

  async _newOrderCountForWholesaler(wholesalerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder("wholesalerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("wholesaler_id = :wholesalerId", { wholesalerId })
      .andWhere("DATE(wholesalerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async wholesalerOrderSummary(wholesalerId: number) {
    const {startOfToday, endOfToday} = getStartAndEndOfToday();

    const result = {
      newOrder: await this._newOrderCountForWholesaler(wholesalerId, startOfToday, endOfToday),
      matchingPending: await this._productMachingPendingCountForSeller(wholesalerId, startOfToday, endOfToday),
      matchingCompleted: await this._productMachingCompleteCountForSeller(wholesalerId, startOfToday, endOfToday),
      orderPending: await this._orderingPendingCountForSeller(wholesalerId, startOfToday, endOfToday),
      orderCompleted: await this._orderingCompleteCountForSeller(wholesalerId, startOfToday, endOfToday),
    };

    return result;
  }

  async findAllSellerOrderForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('sellerOrder')
    .leftJoinAndSelect('sellerOrder.mall', 'mall')
      .leftJoinAndSelect('sellerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerOrder.sellerProductOption', 'sellerProductOption')
      .where('sellerOrder.isDeleted = 0');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` })
            .orWhere('sellerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }
    
    const [sellerOrders, total] = await queryBuilder
      .orderBy('sellerOrder.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const sellerOrder of sellerOrders) {
      const { mall, wholesalerProfile, sellerProfile, sellerProduct, sellerProductOption } = sellerOrder;
      sellerOrder.wholesalerName = wholesalerProfile.name;
      sellerOrder.sellerName = sellerProfile.name;

      sellerOrder.mallName = mall.name;
      sellerOrder.productName = sellerProduct.name;
      sellerOrder.color = sellerProductOption.color;
      sellerOrder.size = sellerProductOption.size;

      delete(sellerOrder.mallId);
      delete(sellerOrder.mall);
      delete(sellerOrder.wholesalerId);
      delete(sellerOrder.wholesalerProfile);
      delete(sellerOrder.wholesalerProductId);
      delete(sellerOrder.wholesalerProductOptionId);
      delete(sellerOrder.sellerId);
      delete(sellerOrder.sellerProfile);
      delete(sellerOrder.sellerProductId);
      delete(sellerOrder.sellerProduct);
      delete(sellerOrder.sellerProductOptionId);
      delete(sellerOrder.sellerProductOption);
      delete(sellerOrder.isDeleted);
    }

    return {
      list: sellerOrders,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findOneSellerOrderForAdmin(orderId: number) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('sellerOrder')
    .leftJoinAndSelect('sellerOrder.mall', 'mall')
      .leftJoinAndSelect('sellerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sellerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerOrder.sellerProductOption', 'sellerProductOption')
      .where('sellerOrder.id = :orderId', { orderId })
      .andWhere('sellerOrder.isDeleted = 0');

    const sellerOrder = await queryBuilder.getOne();
    const { mall, wholesalerProfile, sellerProfile, sellerProduct, sellerProductOption } = sellerOrder;
    const { address1, address2 } = sellerProfile;

    sellerOrder.mallName = mall.name;
    sellerOrder.wholesalerProfile.wholesalerId = wholesalerProfile.userId;
    sellerOrder.wholesalerProfile.storeName = wholesalerProfile.store.name;
    sellerOrder.sellerProfile.sellerId = sellerProfile.userId;
    sellerOrder.sellerProfile.address = address1 + " " + address2;
    //sellerOrder.sellerProduct.productId = wholesalerProduct.id;
    sellerOrder.sellerProduct.price = formatCurrency(sellerOrder.sellerProduct.price);
    sellerOrder.sellerProduct.color = sellerProductOption.color;
    sellerOrder.sellerProduct.size = sellerProductOption.size;

    delete(sellerOrder.mallId);
    delete(sellerOrder.mall);
    delete(sellerOrder.wholesalerId);
    delete(sellerOrder.wholesalerProfile.userId);
    delete(sellerOrder.wholesalerProfile.storeId);
    delete(sellerOrder.wholesalerProfile.store);
    delete(sellerOrder.sellerId);
    delete(sellerOrder.sellerProfile.userId);
    delete(sellerOrder.sellerProfile.address1);
    delete(sellerOrder.sellerProfile.address2);
    delete(sellerOrder.wholesalerProductId);
    //delete(wholesalerOrder.wholesalerProduct.id);
    delete(sellerOrder.wholesalerProductOptionId);
    delete(sellerOrder.sellerProductOption);
    delete(sellerOrder.sellerProductId);
    delete(sellerOrder.sellerProduct.mallId);
    delete(sellerOrder.sellerProduct.sellerId);
    delete(sellerOrder.sellerProduct.wholesalerId);
    delete(sellerOrder.sellerProduct.wholesalerProductId);
    delete(sellerOrder.sellerProduct.wholesalerProductPrice);
    delete(sellerOrder.sellerProductOptionId);
    delete(sellerOrder.isDeleted);
    delete(sellerOrder.status);
    
    return sellerOrder;
  }

  async findAllSellerOrderWaitBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('order.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('order.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.isMatching = 1');

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

  async _sellerOrderTotalCount(startDate: string, endDate: string) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'SUM(sellerOrder.quantity) AS quantity'
      ])
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });
    
    const result = await queryBuilder.getRawOne();
    return Number(result.quantity);
  }

  async _sellerOrderTotalPrice(startDate: string, endDate: string) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'SUM(sellerOrder.quantity * sellerProduct.price) AS price'
      ])
      .leftJoin('sellerOrder.sellerProduct', 'sellerProduct')
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });
    
    const result = await queryBuilder.getRawOne();
    return formatCurrency(Number(result.price));
  }

  async _sellerOrderTotalProductCount(startDate: string, endDate: string) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(DISTINCT sellerOrder.sellerProductId) AS count'
      ])
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _sellerOrderTotalProductOptionCount(startDate: string, endDate: string) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(DISTINCT sellerOrder.sellerProductOptionId) AS count'
      ])
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async sellerOrderStatistics(startDate: string, endDate: string) {
    const formatStartDay = formatHyphenDay(startDate);
    const formatEndDay = formatHyphenDay(endDate);

    const totalCount = await this._sellerOrderTotalCount(formatStartDay, formatEndDay);
    const totalPrice = await this._sellerOrderTotalPrice(formatStartDay, formatEndDay);
    const totalProductCount = await this._sellerOrderTotalProductCount(formatStartDay, formatEndDay);
    const totalProductOptionCount = await this._sellerOrderTotalProductOptionCount(formatStartDay, formatEndDay);

    return {
      totalCount,
      totalPrice,
      totalProductCount,
      totalProductOptionCount
    }
  }

  async sellerOrderVolumeBySeller(startDate: string, endDate: string, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const formatStartDay = formatHyphenDay(startDate);
    const formatEndDay = formatHyphenDay(endDate);

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'sellerProfile.name AS name',
        "CONCAT(sellerProfile.address1, ' ', sellerProfile.address2) AS address",
        'SUM(sellerOrder.quantity) AS quantity'
      ])
      .leftJoin('sellerOrder.sellerProfile', 'sellerProfile')
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate: formatStartDay, endDate: formatEndDay })
      .groupBy("sellerOrder.sellerId")
      .orderBy("quantity", "DESC");

    // query가 존재하면 조건 추가
    if (query) {
      queryBuilder.andWhere('sellerProfile.name LIKE :query', { query: `%${query}%` });
    }
    
    // 전체 데이터 가져오기
    const allVolumes = await queryBuilder.getRawMany();

    // JavaScript로 페이징 처리
    const total = allVolumes.length;
    const volumes = allVolumes.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    return {
      list: volumes,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async sellerOrderVolumeByMall(startDate: string, endDate: string) {
    const formatStartDay = formatHyphenDay(startDate);
    const formatEndDay = formatHyphenDay(endDate);

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'mall.name AS name',
        'SUM(sellerOrder.quantity) AS quantity',
        "CONCAT(ROUND((SUM(sellerOrder.quantity) * 100.0 / SUM(SUM(sellerOrder.quantity)) OVER()), 1), '%') AS percent"
      ])
      .leftJoin('sellerOrder.mall', 'mall')
      .where("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate: formatStartDay, endDate: formatEndDay })
      .groupBy("sellerOrder.mallId")
      .orderBy("quantity", "DESC");
    
    const volumes = await queryBuilder.getRawMany();

    return volumes;
  }

  async _newOrderCountForSeller(sellerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("seller_id = :sellerId", { sellerId })
      .andWhere("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate });

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _productMachingPendingCountForSeller(sellerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("seller_id = :sellerId", { sellerId })
      .andWhere("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate })
      .andWhere("sellerOrder.isMatching = 0");

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _productMachingCompleteCountForSeller(sellerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("seller_id = :sellerId", { sellerId })
      .andWhere("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate })
      .andWhere("sellerOrder.isMatching = 1");

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _orderingPendingCountForSeller(sellerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("seller_id = :sellerId", { sellerId })
      .andWhere("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate })
      .andWhere("sellerOrder.isMatching = 1")
      .andWhere("sellerOrder.isOrdering = 0");

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async _orderingCompleteCountForSeller(sellerId: number, startDate: Date, endDate: Date) {
    const queryBuilder = this.sellerOrderRepository.createQueryBuilder("sellerOrder")
      .select([
        'COUNT(*) AS count'
      ])
      .where("seller_id = :sellerId", { sellerId })
      .andWhere("DATE(sellerOrder.createdAt) BETWEEN :startDate AND :endDate", 
        { startDate, endDate })
      .andWhere("sellerOrder.isOrdering = 1");

    const result = await queryBuilder.getRawOne();
    return Number(result.count);
  }

  async sellerOrderSummary(sellerId: number) {
    const {startOfToday, endOfToday} = getStartAndEndOfToday();

    const result = {
      newOrder: await this._newOrderCountForSeller(sellerId, startOfToday, endOfToday),
      matchingPending: await this._productMachingPendingCountForSeller(sellerId, startOfToday, endOfToday),
      matchingCompleted: await this._productMachingCompleteCountForSeller(sellerId, startOfToday, endOfToday),
      orderPending: await this._orderingPendingCountForSeller(sellerId, startOfToday, endOfToday),
      orderCompleted: await this._orderingCompleteCountForSeller(sellerId, startOfToday, endOfToday),
    };

    return result;
  }
}
