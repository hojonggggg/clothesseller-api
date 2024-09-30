import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateSellerRegisterProductDto {
  @ApiProperty({ example: '1', description: '등록 요청 상품 ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @IsString()
  wholesalerProductName: string;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;
}