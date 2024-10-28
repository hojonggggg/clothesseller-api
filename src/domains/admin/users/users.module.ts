import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { Store } from 'src/domains/wholesaler/stores/entities/store.entity';
import { AdminUsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, WholesalerProfile, SellerProfile])],
  providers: [UsersService],
  controllers: [AdminUsersController]
})
export class AdminUsersModule {}
