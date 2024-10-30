import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerSamplesService } from './samples.service';
import { SellerSamplesController } from './samples.controller';
import { Sample } from 'src/commons/shared/samples/entities/sample.entity';
import { Return } from 'src/commons/shared/entities/return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sample, Return])],
  providers: [SellerSamplesService],
  controllers: [SellerSamplesController]
})
export class SellerSamplesModule {}
