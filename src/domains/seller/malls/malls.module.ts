import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MallsService } from 'src/commons/shared/malls/malls.service';
import { SellerMallsController } from './malls.controller';
import { Mall } from '../../../commons/shared/malls/entities/mall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mall])],
  providers: [MallsService],
  controllers: [SellerMallsController]
})
export class SellerMallsModule {}
