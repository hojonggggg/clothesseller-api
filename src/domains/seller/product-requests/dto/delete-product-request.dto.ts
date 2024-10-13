import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteProductRequestDto {
  @ApiProperty({ example: 1, description: '등록 요청 상품 ID' })
  @IsNumber()
  id: number;
}