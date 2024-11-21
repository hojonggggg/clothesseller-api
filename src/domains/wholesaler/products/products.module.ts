import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerProductsService } from './products.service';
import { WholesalerProductsController } from './products.controller';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, WholesalerProductOption, SellerProduct, SellerProductOption, SellerProductPlus])],
  providers: [ProductsService, WholesalerProductsService],
  controllers: [WholesalerProductsController]
})
export class WholesalerProductsModule {}
