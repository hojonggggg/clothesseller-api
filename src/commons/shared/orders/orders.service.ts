import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { WholesalerOrder } from '../orders/entities/wholesaler-order.entity';
import { SellerOrder } from './entities/seller-order.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class OrdersService {
  constructor(
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

  async findAllSellerOrderForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerOrderRepository.createQueryBuilder('sellerOrder')
    .leftJoinAndSelect('sellerOrder.mall', 'mall')
      .leftJoinAndSelect('sellerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerOrder.sellerProductOption', 'sellerProductOption')
      .where('sellerOrder.isDeleted = 0');
    /*
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` })
            .orWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }
    */
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
      .leftJoinAndSelect('sellerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sellerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerOrder.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerOrder.sellerProductOption', 'sellerProductOption')
      .where('sellerOrder.id = :orderId', { orderId })
      .andWhere('sellerOrder.isDeleted = 0');

    const sellerOrder = await queryBuilder.getOne();
    //const { wholesalerProfile, sellerProfile, wholesalerProduct, wholesalerProductOption } = sellerOrder;
    //const { address1, address2 } = sellerProfile;
    /*
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
    */
    return sellerOrder;
  }
}
