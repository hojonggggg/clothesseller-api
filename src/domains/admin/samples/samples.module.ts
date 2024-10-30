import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSamplesController } from './samples.controller';
import { SamplesService } from 'src/commons/shared/samples/samples.service';
import { Sample } from 'src/commons/shared/samples/entities/sample.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sample])],
  providers: [SamplesService],
  controllers: [AdminSamplesController]
})
export class AdminSamplesModule {}
