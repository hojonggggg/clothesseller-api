import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './domains/auth/auth.module';
import { AdminModule } from './domains/admin/admin.module';
import { WholesalerModule } from './domains/wholesaler/wholesaler.module';
import { SellerModule } from './domains/seller/seller.module';
import configuration from './commons/config/configuration';
import * as moment from 'moment-timezone';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        moment.tz.setDefault('Asia/Seoul');
        return {
          type: 'mysql',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('database.synchronize'),
          //timezone: '-09:00',
        }
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // '/uploads' 경로로 정적 파일 제공
      serveRoot: '/uploads', // URL에서 '/uploads'로 접근 가능
    }),
    AuthModule,
    AdminModule,
    WholesalerModule,
    SellerModule,
  ],
})
export class AppModule {}
