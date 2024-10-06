import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { AuthService } from 'src/commons/shared/auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { SellerAuthService } from './auth/seller-auth.service';
import { SellerAuthController } from './auth/seller-auth.controller';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { MallsModule } from './malls/malls.module';
import { DeliverymanModule } from './deliveryman/deliveryman.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WholesalerProfile, SellerProfile]),
    //UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MallsModule,
    DeliverymanModule,
  ],
  providers: [AuthService, SellerAuthService, UsersService],
  controllers: [SellerAuthController],
  //exports: [SellerModule]
})
export class SellerModule {}
