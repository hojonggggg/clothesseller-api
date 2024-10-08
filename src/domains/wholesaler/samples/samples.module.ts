import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerSamplesService } from './samples.service';
import { WholesalerSamplesController } from './samples.controller';
import { Sample } from 'src/commons/shared/entities/sample.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  providers: [WholesalerSamplesService],
  controllers: [WholesalerSamplesController]
})
export class WholesalerSamplesModule {}
