import { Module } from '@nestjs/common';
import { WholesalerReturnsService } from './returns.service';
import { WholesalerReturnsController } from './returns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Return])],
  providers: [WholesalerReturnsService],
  controllers: [WholesalerReturnsController]
})
export class WholesalerReturnsModule {}
