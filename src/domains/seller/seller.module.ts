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
import { SellerMallsModule } from './malls/malls.module';
import { DeliverymanModule } from './deliveryman/deliveryman.module';
import { ProductRequestsModule } from './product-requests/product-requests.module';
import { SellerProductsModule } from './products/products.module';
import { SellerSamplesModule } from './samples/samples.module';
import { SellerOrdersModule } from './orders/orders.module';
import { SellerReturnsModule } from './returns/returns.module';
import { SellerUsersModule } from './users/users.module';
import { SellerAccountBooksModule } from './account-books/account-books.module';
import { SellerWeekProductsModule } from './week-products/week-products.module';
import { SellerProductMachingsModule } from './product-matchings/product-machings.module';
import { Alimtalk } from 'src/commons/shared/users/entities/alimtalk.entity';
import { MallApiController } from './mall-api/mall-api.controller';
import { MallApiModule } from 'src/commons/shared/mall-api/mall-api.module';
import { MallApiService } from 'src/commons/shared/mall-api/mall-api.service';
import { SellerApi } from 'src/commons/shared/mall-api/entities/seller-api.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WholesalerProfile, SellerProfile, Alimtalk, SellerApi]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    SellerMallsModule,
    DeliverymanModule,
    SellerUsersModule,
    ProductRequestsModule,
    SellerProductsModule,
    SellerOrdersModule,
    SellerSamplesModule,
    SellerReturnsModule,
    SellerAccountBooksModule,
    SellerWeekProductsModule,
    SellerProductMachingsModule,
    MallApiModule
  ],
  providers: [AuthService, SellerAuthService, UsersService, MallApiService],
  controllers: [SellerAuthController, MallApiController]
})
export class SellerModule {}
