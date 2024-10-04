import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MallsService } from './malls.service';
import { MallsController } from './malls.controller';
import { Mall } from './entities/mall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mall])],
  providers: [MallsService],
  controllers: [MallsController]
})
export class MallsModule {}
