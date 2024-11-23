import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { Deliveryman } from './entities/deliveryman.entity';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { SellerProductsService } from '../products/products.service';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/orders/entities/wholesaler-order-history.entity';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
//import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { SellerReturnsService } from '../returns/returns.service';
import { Return } from 'src/commons/shared/returns/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deliveryman, SellerProduct, SellerProductOption, SellerProductPlus, WholesalerOrder, WholesalerOrderHistory, WholesalerProduct, WholesalerProductOption, SellerOrder, Return])],
  providers: [DeliverymanService, ProductsService, SellerProductsService, OrdersService, WholesalerOrdersService, SellerReturnsService],
  controllers: [DeliverymanController]
})
export class DeliverymanModule {}
