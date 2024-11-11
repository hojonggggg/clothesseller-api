import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerProductMatchingsController } from './product-machings.controller';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { ProductMatchingsService } from 'src/commons/shared/product-matchings/product-matchings.service';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/commons/shared/products/entities/wholesaler-product-option.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerProduct,
      SellerProductOption,
      WholesalerProduct, 
      WholesalerProductOption
    ])
  ],
  providers: [ProductsService, ProductMatchingsService],
  controllers: [SellerProductMatchingsController]
})
export class SellerProductMachingsModule {}
