import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrdersController } from './orders.controller';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/commons/shared/products/entities/wholesaler-product-option.entity';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder, WholesalerProduct, WholesalerProductOption, SellerOrder, SellerProduct, SellerProductOption, SellerProductPlus])],
  providers: [OrdersService, ProductsService],
  controllers: [AdminOrdersController]
})
export class AdminOrdersModule {}
