import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProductRequestsController } from './product-requests.controller';
import { ProductRequestsService } from 'src/commons/shared/product-requests/product-requests.service';
import { ProductRequest } from 'src/commons/shared/product-requests/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/product-requests/entities/product-request-option.entity';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerProduct } from 'src/commons/shared/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/commons/shared/products/entities/wholesaler-product-option.entity';
import { SellerProduct } from 'src/commons/shared/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/commons/shared/products/entities/seller-product-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRequest,
      ProductRequestOption,
      WholesalerProduct,
      WholesalerProductOption,
      SellerProduct,
      SellerProductOption
    ])
  ],
  providers: [ProductRequestsService, ProductsService],
  controllers: [AdminProductRequestsController]
})
export class AdminProductRequestsModule {}
