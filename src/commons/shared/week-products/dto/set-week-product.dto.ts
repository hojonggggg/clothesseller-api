import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

class SetWeekProductDetailDto {
  @ApiProperty({ example: '1', description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: '1', description: '노출 순서' })
  @IsNumber()
  seq: number;
}

export class SetWeekProductDto {
  @ApiProperty({ example: [{wholesalerProductId: 1, seq: 1}, {wholesalerProductId: 2, seq: 2}], description: '금주의 상품 목록' })
  @IsArray()
  products: SetWeekProductDetailDto[];
}