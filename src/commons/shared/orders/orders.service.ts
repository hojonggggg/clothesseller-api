import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { WholesalerOrder } from '../orders/entities/wholesaler-order.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
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

}
