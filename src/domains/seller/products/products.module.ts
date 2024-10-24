import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductsService } from './products.service';
import { SellerProductsController } from './products.controller';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct, SellerProductOption, Return, WholesalerProduct, WholesalerProductOption])],
  providers: [SellerProductsService, WholesalerProductsService],
  controllers: [SellerProductsController]
})
export class SellerProductsModule {}
