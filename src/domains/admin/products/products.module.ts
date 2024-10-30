import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ProductsService } from './products.service';
import { AdminProductsController } from './products.controller';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { SellerProductsService } from 'src/domains/seller/products/products.service';
import { SellerProduct } from 'src/domains/seller/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/domains/seller/products/entities/seller-product-option.entity';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, WholesalerProductOption, SellerProduct, SellerProductOption, Return])],
  providers: [WholesalerProductsService, SellerProductsService],
  controllers: [AdminProductsController]
})
export class AdminProductsModule {}
