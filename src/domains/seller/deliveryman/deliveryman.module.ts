import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { Deliveryman } from './entities/deliveryman.entity';
import { SellerProductsService } from '../products/products.service';
import { SellerProduct } from '../products/entities/seller-product.entity';
import { SellerProductOption } from '../products/entities/seller-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deliveryman, SellerProduct, SellerProductOption])],
  providers: [DeliverymanService, SellerProductsService],
  controllers: [DeliverymanController]
})
export class DeliverymanModule {}
