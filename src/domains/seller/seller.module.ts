import { Module } from '@nestjs/common';
import { SellerProductsModule } from './products/sellerProducts.module';

@Module({
  imports: [SellerProductsModule],
  providers: [],
  controllers: []
})
export class SellerModule {}
