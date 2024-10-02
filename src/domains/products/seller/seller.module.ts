import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductsService } from './seller.service';
import { SellerProduct } from './entities/seller-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerProduct])],
  providers: [SellerProductsService]
})
export class SellerProductsModule {}
