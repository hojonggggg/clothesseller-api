import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductMatchingsController } from './product-machings.controller';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { ProductMatchingsService } from 'src/commons/shared/product-matchings/product-matchings.service';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/commons/shared/products/entities/wholesaler-product-option.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WholesalerProduct, 
      WholesalerProductOption,
      SellerProduct,
      SellerProductOption,
      SellerProductPlus,
      SellerOrder,
    ])
  ],
  providers: [ProductsService, ProductMatchingsService],
  controllers: [SellerProductMatchingsController]
})
export class SellerProductMachingsModule {}
