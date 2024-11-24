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
import { AdminProductRequestsModule } from './product-requests/product-requests.module';
import { AdminProductsModule } from './products/products.module';
import { AdminSamplesModule } from './samples/samples.module';
import { AdminPrepaymentsModule } from './prepayments/prepayments.module';
import { AdminOrdersModule } from './orders/orders.module';
import { AdminWeekProductsModule } from './week-products/week-products.module';
import { AdminBoardsModule } from './boards/boards.module';
import { ImageUploadController } from './image-upload/image-upload.controller';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ImageUploadService } from 'src/commons/shared/image-upload/image-upload.service';
import { Alimtalk } from 'src/commons/shared/users/entities/alimtalk.entity';

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
    AdminUsersModule,
    AdminProductRequestsModule,
    AdminProductsModule,
    AdminSamplesModule,
    AdminOrdersModule,
    AdminPrepaymentsModule,
    AdminWeekProductsModule,
    AdminBoardsModule,
    ImageUploadModule,
  ],
  providers: [AuthService, UsersService, ImageUploadService],
  controllers: [ImageUploadController],
  //exports: [AdminModule]
})
export class AdminModule {}
