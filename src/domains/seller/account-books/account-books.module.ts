import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerAccountBooksService } from './account-books.service';
import { SellerAccountBooksController } from './account-books.controller';
import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { TaxInvoice } from 'src/commons/shared/entities/tax-invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WholesalerOrder, TaxInvoice])],
  providers: [SellerAccountBooksService],
  controllers: [SellerAccountBooksController]
})
export class SellerAccountBooksModule {}
