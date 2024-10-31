import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerOrdersController } from './orders.controller';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { WholesalerOrderHistory } from 'src/commons/shared/orders/entities/wholesaler-order-history.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder, WholesalerOrderHistory, WholesalerProductOption])],
  providers: [WholesalerOrdersService],
  controllers: [WholesalerOrdersController]
})
export class WholesalerOrdersModule {}
