import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnsService } from 'src/commons/shared/returns/returns.service';
import { SellerReturnsService } from './returns.service';
import { SellerReturnsController } from './returns.controller';
import { Return } from 'src/commons/shared/returns/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Return])],
  providers: [ReturnsService, SellerReturnsService],
  controllers: [SellerReturnsController]
})
export class SellerReturnsModule {}
