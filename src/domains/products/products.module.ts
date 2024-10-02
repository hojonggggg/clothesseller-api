import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { WholesalerProductsService } from './wholesaler/wholesaler.service';
import { WholesalerProduct } from './wholesaler/entities/wholesaler-product.entity';
import { SellerProductsService } from './seller/seller.service';
import { SellerProduct } from './seller/entities/seller-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, SellerProduct])],
  providers: [ProductsService, WholesalerProductsService, SellerProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
