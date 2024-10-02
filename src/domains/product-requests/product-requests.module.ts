import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequest } from './entities/product-request.entity';
import { WholesalerProductsModule } from '../products/wholesaler/wholesaler.module';
import { WholesalerProductsService } from '../products/wholesaler/wholesaler.service';
import { WholesalerProduct } from '../products/wholesaler/entities/wholesaler-product.entity';
import { SellerProductsService } from '../products/seller/seller.service';
import { SellerProduct } from '../products/seller/entities/seller-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRequest, WholesalerProduct, SellerProduct]), WholesalerProductsModule],
  providers: [ProductRequestsService, WholesalerProductsService, SellerProductsService],
  controllers: [ProductRequestsController],
})
export class ProductRequestsModule {}
