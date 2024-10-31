import { Module } from '@nestjs/common';
import { PrepaymentsService } from './prepayments.service';

@Module({
  providers: [PrepaymentsService]
})
export class PrepaymentsModule {}
