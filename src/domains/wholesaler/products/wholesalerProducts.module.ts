import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerProductsService } from './wholesalerProducts.service';
import { WholesalerProductsController } from './wholesalerProducts.controller';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { SellerProductsService } from 'src/domains/seller/products/sellerProducts.service';
import { SellerRegisterProduct } from 'src/domains/seller/products/entities/seller-register-product.entity';
import { SellerProduct } from 'src/domains/seller/products/entities/seller-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, SellerRegisterProduct, SellerProduct])],
  controllers: [WholesalerProductsController],
  providers: [WholesalerProductsService, SellerProductsService],
  exports: [WholesalerProductsService],
})
export class WholesalerProductsModule {}
