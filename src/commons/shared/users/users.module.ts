import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Store } from 'src/domains/wholesaler/stores/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      WholesalerProfile, 
      SellerProfile,
      //Store
    ])
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
