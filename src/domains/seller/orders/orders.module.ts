import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerOrdersService } from './orders.service';
import { SellerOrdersController } from './orders.controller';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerOrder, WholesalerOrder])],
  providers: [SellerOrdersService],
  controllers: [SellerOrdersController]
})
export class SellerOrdersModule {}
