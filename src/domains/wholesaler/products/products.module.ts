import { Module } from '@nestjs/common';
import { WholesalerProductsService } from './products.service';
import { WholesalerProductsController } from './products.controller';

@Module({
  providers: [WholesalerProductsService],
  controllers: [WholesalerProductsController]
})
export class WholesalerProductsModule {}
