import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRequest, ProductRequestOption])],
  providers: [ProductRequestsService],
  controllers: [ProductRequestsController]
})
export class ProductRequestsModule {}
