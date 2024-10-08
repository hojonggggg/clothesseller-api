import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerOrdersController } from './orders.controller';
import { Order } from 'src/commons/shared/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [WholesalerOrdersService],
  controllers: [WholesalerOrdersController]
})
export class WholesalerOrdersModule {}
