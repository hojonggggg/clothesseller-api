import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerAccountBooksService } from './account-books.service';
import { SellerAccountBooksController } from './account-books.controller';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder])],
  providers: [SellerAccountBooksService],
  controllers: [SellerAccountBooksController]
})
export class SellerAccountBooksModule {}
