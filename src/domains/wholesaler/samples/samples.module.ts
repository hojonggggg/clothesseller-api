import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplesService } from 'src/commons/shared/samples/samples.service';
import { WholesalerSamplesService } from './samples.service';
import { WholesalerSamplesController } from './samples.controller';
import { Sample } from 'src/commons/shared/samples/entities/sample.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  providers: [SamplesService, WholesalerSamplesService],
  controllers: [WholesalerSamplesController]
})
export class WholesalerSamplesModule {}
