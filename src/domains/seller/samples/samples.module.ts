import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerSamplesService } from './samples.service';
import { SellerSamplesController } from './samples.controller';
import { Sample } from 'src/commons/shared/entities/sample.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  providers: [SellerSamplesService],
  controllers: [SellerSamplesController]
})
export class SellerSamplesModule {}
