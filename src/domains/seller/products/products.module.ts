import { Module } from '@nestjs/common';
import { SellerProductsService } from './products.service';
import { SellerProductsController } from './products.controller';

@Module({
  providers: [SellerProductsService],
  controllers: [SellerProductsController]
})
export class SellerProductsModule {}
