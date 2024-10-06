import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { Deliveryman } from './entities/deliveryman.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deliveryman])],
  providers: [DeliverymanService],
  controllers: [DeliverymanController]
})
export class DeliverymanModule {}
