import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSellerRegisterProductDto {
  @ApiProperty({ example: '2', description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @IsString()
  wholesalerProductName: string;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @IsString()
  sellerProductName: string;

  @ApiProperty({ example: '10000', description: '판매 가격' })
  @IsNumber()
  sellerProductPrice: number;
}