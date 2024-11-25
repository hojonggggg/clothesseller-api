import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { LocalStrategy } from '../auth/strategies/local.strategy';
//import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { WholesalerAuthModule } from './auth/wholesaler-auth.module';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { WholesalerProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { WholesalerOrdersModule } from './orders/orders.module';
import { WholesalerSamplesModule } from './samples/samples.module';
import { WholesalerProductRequestsModule } from './product-requests/product-requests.module';
import { WholesalerReturnsModule } from './returns/returns.module';
import { WholesalerUsersModule } from './users/users.module';
import { WholesalerWeekProductsModule } from './week-products/week-products.module';
import { Alimtalk } from 'src/commons/shared/users/entities/alimtalk.entity';
import { WholesalerLedgerModule } from './account-book/account-book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      WholesalerProfile, 
      SellerProfile,
      Alimtalk
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
    WholesalerAuthModule,
    StoresModule,
    WholesalerProductRequestsModule,
    WholesalerProductsModule,
    WholesalerOrdersModule,
    WholesalerSamplesModule,
    WholesalerReturnsModule,
    WholesalerUsersModule,
    WholesalerWeekProductsModule,
    WholesalerLedgerModule,
  ],
  providers: [AuthService, UsersService],
  controllers: [],
  exports: [WholesalerModule]
})
export class WholesalerModule {}
