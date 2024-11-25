import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WholesalerAccountBookController } from './account-book.controller';
import { AccountBookService } from 'src/commons/shared/account-book/account-book.service';
//import { WholesalerOrder } from 'src/commons/shared/orders/entities/wholesaler-order.entity';
import { AccountBook } from 'src/commons/shared/account-book/entities/account-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountBook])],
  providers: [AccountBookService],
  controllers: [WholesalerAccountBookController]
})
export class WholesalerLedgerModule {}
