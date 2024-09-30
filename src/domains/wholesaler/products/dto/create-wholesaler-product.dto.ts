import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateWholesalerProductDto {
  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @IsString()
  productName: string;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @IsNumber()
  productPrice: number;
}