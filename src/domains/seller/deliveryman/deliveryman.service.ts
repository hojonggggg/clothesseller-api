import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deliveryman } from './entities/deliveryman.entity';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';

@Injectable()
export class DeliverymanService {
  constructor(
    @InjectRepository(Deliveryman)
    private deliverymanRepository: Repository<Deliveryman>,
  ) {}

  async createDeliveryman(sellerId: number, createDeliverymanDto: CreateDeliverymanDto): Promise<Deliveryman> {
    console.log({sellerId, createDeliverymanDto});
    return await this.deliverymanRepository.save({
      sellerId,
      ...createDeliverymanDto
    });
  }

  async findOneDeliverymanBySellerIdAndMobile(sellerId: number, mobile: string): Promise<Deliveryman | undefined> {
    return await this.deliverymanRepository.findOne({ where: {sellerId, mobile} });
  }
}
