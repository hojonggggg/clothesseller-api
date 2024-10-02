import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequest } from './entities/product-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRequest])],
  providers: [ProductRequestsService],
  controllers: [ProductRequestsController]
})
export class ProductRequestsModule {}
