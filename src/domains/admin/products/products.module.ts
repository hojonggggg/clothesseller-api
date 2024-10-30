import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ProductsService } from './products.service';
import { AdminProductsController } from './products.controller';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerProduct, WholesalerProductOption])],
  providers: [WholesalerProductsService],
  controllers: [AdminProductsController]
})
export class AdminProductsModule {}
