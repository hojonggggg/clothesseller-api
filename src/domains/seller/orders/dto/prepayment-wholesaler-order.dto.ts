import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class PrepaymentWholesalerOrderDto {
  @ApiProperty({ example: [1, 2], description: '상품 주문 ID 목록' })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}