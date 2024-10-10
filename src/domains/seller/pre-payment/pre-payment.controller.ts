import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seller > pre-payment')
@Controller('seller/pre-payment')
export class PrePaymentController {}
