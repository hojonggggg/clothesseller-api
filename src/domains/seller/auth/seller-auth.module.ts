import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { LocalStrategy } from 'src/commons/shared/auth/strategies/local.strategy';
import { LocalStrategy } from 'src/domains/auth/strategies/local.strategy';
//import { JwtStrategy } from 'src/commons/shared/auth/strategies/jwt.strategy';
import { JwtStrategy } from 'src/domains/auth/strategies/jwt.strategy';
//import { WholesalerAuthService } from './wholesaler-auth.service';
import { SellerAuthService } from './seller-auth.service';
//import { WholesalerAuthController } from './wholesaler-auth.controller';
import { SellerAuthController } from './seller-auth.controller';
import { UsersModule } from 'src/commons/shared/users/users.module';
import { UsersService } from 'src/commons/shared/users/users.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, SellerAuthService, UsersService],
  controllers: [SellerAuthController],
  //exports: [WholesalerAuthModule]
})
export class SellerAuthModule {}
