import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductsService } from './sellerProducts.service';
import { SellerProductsController } from './sellerProducts.controller';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerRegisterProduct } from './entities/seller-register-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct, SellerRegisterProduct])],
  controllers: [SellerProductsController],
  providers: [SellerProductsService],
  exports: [SellerProductsService],
})
export class SellerProductsModule {}
