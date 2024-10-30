import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { AdminUsersModule } from './users/users.module';
import { AdminProductsModule } from './products/products.module';
import { AdminSamplesModule } from './samples/samples.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      WholesalerProfile, 
      SellerProfile
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminUsersModule,
    AdminProductsModule,
    AdminSamplesModule,
  ],
  providers: [AuthService, UsersService],
  controllers: [],
  //exports: [AdminModule]
})
export class AdminModule {}
