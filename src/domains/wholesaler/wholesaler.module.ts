import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from 'src/commons/shared/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/commons/shared/auth/strategies/jwt.strategy';
//import { WholesalerService } from './wholesaler.service';
//import { WholesalerController } from './wholesaler.controller';
import { AuthModule } from 'src/commons/shared/auth/auth.module';
import { AuthService } from 'src/commons/shared/auth/auth.service';
import { WholesalerAuthService } from './auth/wholesaler-auth.service';
import { WholesalerAuthController } from './auth/wholesaler-auth.controller';
//import { WholesalerAuthModule } from './auth/auth.module';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';
import { WholesalerProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';

@Module({
  //imports: [TypeOrmModule.forFeature([User, WholesalerProfile]), AuthModule],
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
    WholesalerProductsModule,
    StoresModule,
  ],
  providers: [AuthService, WholesalerAuthService, UsersService],
  controllers: [WholesalerAuthController],
  exports: [WholesalerModule]
})
export class WholesalerModule {}
