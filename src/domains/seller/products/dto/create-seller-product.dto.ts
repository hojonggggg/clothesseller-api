import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

class CreateSellerProductOptionDto {
  @IsNumber()
  wholesalerProductOptionId: number;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateSellerProductDto {
  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @IsNumber()
  mallId: number;

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
  name: string;

  @ApiProperty({ example: 20000, description: '퍈매 가격' })
  @IsNumber()
  price: number;
  /*
  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @IsBoolean()
  isActive: boolean;
  */
  @ApiProperty({ 
    example: [
      { wholesalerProductOptionId: 1, color: 'Black', size: '95', price: 0, quantity: 20 },
      { wholesalerProductOptionId: 2, color: 'Black', size: '100', price: 1000, quantity: 10 }
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSellerProductOptionDto)
  options: CreateSellerProductOptionDto[];
}