import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrdersController } from './orders.controller';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder])],
  providers: [OrdersService],
  controllers: [AdminOrdersController]
})
export class AdminOrdersModule {}
