import { Module } from '@nestjs/common';
import { WholesalerProductsModule } from './products/wholesalerProducts.module';

@Module({
  imports: [WholesalerProductsModule],
  providers: [],
  controllers: []
})
export class WholesalerModule {}
