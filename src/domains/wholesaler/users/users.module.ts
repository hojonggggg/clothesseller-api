import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { WholesalerUsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, WholesalerProfile, SellerProfile])],
  providers: [UsersService],
  controllers: [WholesalerUsersController]
})
export class WholesalerUsersModule {}
