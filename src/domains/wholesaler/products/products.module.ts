import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerProductsService } from './products.service';
import { WholesalerProductsController } from './products.controller';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, WholesalerProductOption])],
  providers: [WholesalerProductsService],
  controllers: [WholesalerProductsController]
})
export class WholesalerProductsModule {}
