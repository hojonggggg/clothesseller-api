import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ProductMatchingDto {
  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @IsNumber()
  sellerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;
}