import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerOrdersController } from './orders.controller';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/orders/entities/wholesaler-order-history.entity';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder, WholesalerOrderHistory, WholesalerProduct, WholesalerProductOption, WholesalerProfile, SellerOrder, SellerProduct, SellerProductOption, SellerProductPlus])],
  providers: [OrdersService, ProductsService, WholesalerOrdersService],
  controllers: [WholesalerOrdersController]
})
export class WholesalerOrdersModule {}
