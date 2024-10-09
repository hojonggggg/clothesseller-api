import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerReturnsService } from './returns.service';
import { SellerReturnsController } from './returns.controller';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Return])],
  providers: [SellerReturnsService],
  controllers: [SellerReturnsController]
})
export class SellerReturnsModule {}
