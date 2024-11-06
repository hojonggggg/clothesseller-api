import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerWeekProductsController } from './week-products.controller';
import { WeekProductsService } from 'src/commons/shared/week-products/week-products.service';
import { WeekProduct } from 'src/commons/shared/week-products/entities/week-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeekProduct])],
  providers: [WeekProductsService],
  controllers: [WholesalerWeekProductsController]
})
export class WholesalerWeekProductsModule {}
