import { Module } from '@nestjs/common';
import { WholesalerAuthService } from './wholesaler-auth.service';
import { WholesalerAuthController } from './wholesaler-auth.controller';
import { AuthModule } from 'src/domains/auth/auth.module';
import { UsersModule } from 'src/commons/shared/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  providers: [WholesalerAuthService],
  controllers: [WholesalerAuthController]
})
export class WholesalerAuthModule {}
