import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from 'src/commons/shared/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/commons/shared/auth/strategies/jwt.strategy';
import { WholesalerAuthService } from './wholesaler-auth.service';
import { WholesalerAuthController } from './wholesaler-auth.controller';
//import { AuthController } from './auth.controller';
//import { WholesalerLocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/commons/shared/users/users.module';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';

@Module({
  imports: [
    //TypeOrmModule.forFeature([User])
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
  providers: [LocalStrategy, JwtStrategy, WholesalerAuthService, UsersService],
  controllers: [WholesalerAuthController],
  exports: [WholesalerAuthModule]
})
export class WholesalerAuthModule {}
