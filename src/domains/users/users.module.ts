import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Deleveryman } from './entities/deleveryman.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WholesalerProfile, SellerProfile, Deleveryman])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
