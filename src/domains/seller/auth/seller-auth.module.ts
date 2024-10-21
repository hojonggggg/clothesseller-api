import { Module } from '@nestjs/common';
import { SellerAuthService } from './seller-auth.service';
import { SellerAuthController } from './seller-auth.controller';
import { AuthModule } from 'src/domains/auth/auth.module';
import { UsersModule } from 'src/commons/shared/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
  ],
  providers: [SellerAuthService],
  controllers: [SellerAuthController],
})
export class SellerAuthModule {}
