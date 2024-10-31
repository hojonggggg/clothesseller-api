import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { WholesalerOrder } from '../orders/entities/wholesaler-order.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class PrepaymentsService {
  constructor(
    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
  ) {}

  async findAllPrepaymentForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wholesalerOrder')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .where('wholesalerOrder.isDeleted = 0')
      .andWhere('wholesalerOrder.isPrepayment = 1');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` })
            .orWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [prepayments, total] = await queryBuilder
      .orderBy('wholesalerOrder.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const prepayment of prepayments) {
      const { wholesalerProfile, sellerProfile, wholesalerProduct } = prepayment;
      prepayment.wholesalerName = wholesalerProfile.name;
      prepayment.sellerName = sellerProfile.name;
      prepayment.productName = wholesalerProduct.name;
      prepayment.quantity = prepayment.quantityOfPrepayment;

      delete(prepayment.wholesalerId);
      delete(prepayment.wholesalerProfile);
      delete(prepayment.orderType);
      delete(prepayment.sellerId);
      delete(prepayment.sellerProfile);
      delete(prepayment.wholesalerProduct);
      delete(prepayment.wholesalerProductId);
      delete(prepayment.wholesalerProductOptionId);
      delete(prepayment.sellerOrderId);
      delete(prepayment.sellerProductId);
      delete(prepayment.sellerProductOptionId);
      delete(prepayment.quantityTotal);
      delete(prepayment.quantityOfDelivery);
      delete(prepayment.quantityOfPrepayment);
      delete(prepayment.isDeleted);
      delete(prepayment.isSoldout);
      delete(prepayment.isPrepayment);
      delete(prepayment.status);
      delete(prepayment.createdAt);
    }

    return {
      list: prepayments,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findOnePrepaymentForAdmin(wholesalerOrderId: number) {
    const queryBuilder = this.wholesalerOrderRepository.createQueryBuilder('wholesalerOrder')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('wholesalerOrder.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('wholesalerOrder.wholesalerProductOption', 'wholesalerProductOption')
      .where('wholesalerOrder.id = :wholesalerOrderId', { wholesalerOrderId })
      .andWhere('wholesalerOrder.isDeleted = 0')
      .andWhere('wholesalerOrder.isPrepayment = 1');

    const prepayment = await queryBuilder.getOne();
    const { wholesalerProfile, sellerProfile, wholesalerProduct, wholesalerProductOption } = prepayment;
    const { address1, address2 } = sellerProfile;

    prepayment.wholesalerProfile.wholesalerId = wholesalerProfile.userId;
    prepayment.wholesalerProfile.storeName = wholesalerProfile.store.name;
    prepayment.sellerProfile.sellerId = sellerProfile.userId;
    prepayment.sellerProfile.address = address1 + " " + address2;
    prepayment.wholesalerProduct.productId = wholesalerProduct.id;
    prepayment.wholesalerProduct.color = wholesalerProductOption.color;
    prepayment.wholesalerProduct.size = wholesalerProductOption.size;
    prepayment.quantity = prepayment.quantityOfPrepayment;

    delete(prepayment.wholesalerId);
    delete(prepayment.wholesalerProfile.userId);
    delete(prepayment.wholesalerProfile.storeId);
    delete(prepayment.wholesalerProfile.store);
    delete(prepayment.orderType);
    delete(prepayment.sellerId);
    delete(prepayment.sellerProfile.userId);
    delete(prepayment.sellerProfile.address1);
    delete(prepayment.sellerProfile.address2);
    delete(prepayment.wholesalerProductId);
    delete(prepayment.wholesalerProduct.id);
    delete(prepayment.wholesalerProduct.price);
    delete(prepayment.wholesalerProductOptionId);
    delete(prepayment.wholesalerProductOption);
    delete(prepayment.sellerOrderId);
    delete(prepayment.sellerProductId);
    delete(prepayment.sellerProductOptionId);
    delete(prepayment.quantityTotal);
    delete(prepayment.quantityOfDelivery);
    delete(prepayment.quantityOfPrepayment);
    delete(prepayment.isDeleted);
    delete(prepayment.isSoldout);
    delete(prepayment.isPrepayment);
    delete(prepayment.status);
    delete(prepayment.createdAt);

    return prepayment;
  }
}
