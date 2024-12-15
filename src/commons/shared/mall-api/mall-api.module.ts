import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MallApiService } from './mall-api.service';
import { SellerApi } from './entities/seller-api.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerApi])],
  providers: [MallApiService]
})
export class MallApiModule {}
