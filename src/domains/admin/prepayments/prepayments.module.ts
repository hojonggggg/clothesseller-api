import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPrepaymentsController } from './prepayments.controller';
import { PrepaymentsService } from 'src/commons/shared/prepayments/prepayments.service';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder])],
  providers: [PrepaymentsService],
  controllers: [AdminPrepaymentsController]
})
export class AdminPrepaymentsModule {}
