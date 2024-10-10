import { Module } from '@nestjs/common';
import { PrePaymentService } from './pre-payment.service';
import { PrePaymentController } from './pre-payment.controller';

@Module({
  providers: [PrePaymentService],
  controllers: [PrePaymentController]
})
export class PrePaymentModule {}
