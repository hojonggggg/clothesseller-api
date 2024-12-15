import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { SellerApi } from './entities/seller-api.entity';
import { CreateSellerApiDto } from './dto/create-seller-api-dto';

@Injectable()
export class MallApiService {
  constructor(
    @InjectRepository(SellerApi)
    private sellerApiRepository: Repository<SellerApi>,
  ) {}

  async findAllSellerApi(sellerId: number) {
    return await this.sellerApiRepository.createQueryBuilder('sa')
      .select([
        'sa.mallId AS mallId',
        'm.name AS mallName',
        'sa.clientId AS clientId',
        'sa.clientSecret AS clientSecret'
      ])
      .leftJoin('sa.mall', 'm')
      .where('sa.sellerId = :sellerId', { sellerId })
      .orderBy('sa.mallId', 'ASC')
      .getRawMany();
  }

  async createSellerApi(sellerId:number, createSellerApiDto: CreateSellerApiDto) {
    return await this.sellerApiRepository.save({
      sellerId,
      ...createSellerApiDto
    });
  }
}
