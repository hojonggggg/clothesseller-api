import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerProductsService } from './wholesaler.service';
import { WholesalerProduct } from './entities/wholesaler-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct])],
  providers: [WholesalerProductsService]
})
export class WholesalerProductsModule {}
