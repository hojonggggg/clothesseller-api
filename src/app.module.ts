import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WholesalerModule } from './domains/wholesaler/wholesaler.module';


import { MallsModule } from './domains/malls/malls.module';
import { StoresModule } from './domains/stores/stores.module';
import { UsersModule } from './domains/users/users.module';
import { ProductRequestsModule } from './domains/product-requests/product-requests.module';
import { ProductsModule } from './domains/products/products.module';
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
    WholesalerModule,

    
    MallsModule,
    StoresModule,
    UsersModule,
    ProductRequestsModule,
    ProductsModule,
  ],
})
export class AppModule {}
