import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSellerProductDto {
  @ApiProperty({ example: '1', description: '판매몰 ID' })
  @IsNumber()
  storeId: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @IsString()
  sellerProductName: string;

  @ApiProperty({ example: '20000', description: '퍈매 가격' })
  @IsNumber()
  sellerProductPrice: number;

  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @IsBoolean()
  isActive: boolean;
}