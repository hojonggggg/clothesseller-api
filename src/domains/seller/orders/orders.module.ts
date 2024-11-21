import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { SellerOrdersService } from './orders.service';
import { SellerOrdersController } from './orders.controller';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/orders/entities/wholesaler-order-history.entity';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/commons/shared/products/entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerOrder, SellerProduct, SellerProductOption, SellerProductPlus, WholesalerOrder, WholesalerOrderHistory, WholesalerProduct, WholesalerProductOption])],
  providers: [OrdersService, ProductsService, SellerOrdersService, WholesalerOrdersService],
  controllers: [SellerOrdersController]
})
export class SellerOrdersModule {}
