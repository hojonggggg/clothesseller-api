import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerOrdersService {
  constructor(
    @InjectRepository(WholesalerOrder)
    private wholesalerOrderRepository: Repository<WholesalerOrder>,
  ) {}

  async findAllOrderByWholesalerId(wholesalerId: number, date: string, paginationQuery: PaginationQueryDto) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { page, limit } = paginationQuery;
    const [orders, total] = await this.wholesalerOrderRepository.findAndCount({
      where: { wholesalerId, createdAt: Between(startOfDay, endOfDay)  },
      relations: ['productOption', 'productOption.wholesalerProduct', 'sellerProfile', 'sellerProfile.deliveryman'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    
    for (const order of orders) {
      order.name = order.productOption.wholesalerProduct.name;
      order.color = order.productOption.color;
      order.size = order.productOption.size;
      order.quantity = order.productOption.quantity;
      order.sellerName = order.sellerProfile.name;
      order.sellerMobile = order.sellerProfile.mobile;
      if (order.sellerProfile.deliveryman) {
        order.deliverymanMobile = order.sellerProfile.deliveryman.mobile;
      } else {
        order.deliverymanMobile = null;
      }
      delete(order.wholesalerId);
      delete(order.wholesalerProductOptionId);
      delete(order.sellerId);
      delete(order.productOption);
      delete(order.sellerProfile);
    }
    
    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

