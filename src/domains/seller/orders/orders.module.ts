import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerOrdersService } from './orders.service';
import { SellerOrdersController } from './orders.controller';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/entities/wholesaler-order-history.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerOrder, WholesalerOrder, WholesalerOrderHistory, WholesalerProductOption])],
  providers: [SellerOrdersService, WholesalerOrdersService],
  controllers: [SellerOrdersController]
})
export class SellerOrdersModule {}
