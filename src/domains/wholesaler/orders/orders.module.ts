import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerOrdersController } from './orders.controller';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder, WholesalerProductOption])],
  providers: [WholesalerOrdersService],
  controllers: [WholesalerOrdersController]
})
export class WholesalerOrdersModule {}
