import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteSellerProductDto {
  @ApiProperty({ example: 1, description: '상품 옵션 ID' })
  @IsNumber()
  id: number;
}