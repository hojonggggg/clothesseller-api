import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WholesalerCreatePrepaymentDto {

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;
  
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @IsNumber()
  sellerId: number;

  @ApiProperty({ example: 10, description: '미송 수량' })
  @IsNumber()
  quantity: number;
}