import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductsService } from './products.service';
import { SellerProductsController } from './products.controller';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct, SellerProductOption])],
  providers: [SellerProductsService],
  controllers: [SellerProductsController]
})
export class SellerProductsModule {}
