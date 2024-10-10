import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SellerReturnSampleDto {
  @ApiProperty({ example: 1, description: '샘플 ID' })
  @IsNumber()
  id: number;
}