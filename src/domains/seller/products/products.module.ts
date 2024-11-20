import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { SellerProductsService } from './products.service';
import { SellerProductsController } from './products.controller';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { Return } from 'src/commons/shared/returns/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct, SellerProductOption, Return, WholesalerProduct, WholesalerProductOption])],
  providers: [ProductsService, SellerProductsService, WholesalerProductsService],
  controllers: [SellerProductsController]
})
export class SellerProductsModule {}
