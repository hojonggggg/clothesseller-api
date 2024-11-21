import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestsService } from 'src/commons/shared/product-requests/product-requests.service';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';
import { WholesalerProduct } from '../products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';
import { SellerProductPlus } from 'src/commons/shared/products/entities/seller-product-plus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRequest, 
      ProductRequestOption, 
      WholesalerProduct, 
      WholesalerProductOption, 
      SellerProduct, 
      SellerProductOption,
      SellerProductPlus
    ])
  ],
  providers: [ProductRequestsService, ProductsService],
  controllers: [ProductRequestsController]
})
export class WholesalerProductRequestsModule {}
