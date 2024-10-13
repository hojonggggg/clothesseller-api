import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class DeleteSellerProductDto {
  @ApiProperty({ example: [1, 2], description: '상품 옵션 ID 목록' })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}