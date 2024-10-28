import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { Deliveryman } from './entities/deliveryman.entity';
import { SellerProductsService } from '../products/products.service';
import { SellerProduct } from '../products/entities/seller-product.entity';
import { SellerProductOption } from '../products/entities/seller-product-option.entity';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/entities/wholesaler-order-history.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { SellerReturnsService } from '../returns/returns.service';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deliveryman, SellerProduct, SellerProductOption, WholesalerOrder, WholesalerOrderHistory, WholesalerProductOption, Return])],
  providers: [DeliverymanService, SellerProductsService, WholesalerOrdersService, SellerReturnsService],
  controllers: [DeliverymanController]
})
export class DeliverymanModule {}
