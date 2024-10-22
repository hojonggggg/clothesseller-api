import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class UpdateSellerProductOptionDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNumber()
  @IsOptional()
  wholesalerProductOptionId: number;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsNumber()
  price: number;
  
  @IsNumber()
  wholesalerOptionPrice: number;

  @IsNumber()
  quantity: number;

  @IsString()
  status: string;

  @IsBoolean()
  isShow: boolean;

  @IsBoolean()
  isDeleted: boolean;
}

export class UpdateSellerProductDto {
  @ApiProperty({ example: '10000', description: '도매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @IsString()
  name: string;

  @ApiProperty({ example: '20000', description: '퍈매 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    example: [
      { id: 1, color: 'Black', size: '100', price: 0, wholesalerOptionPrice: 0, quantity: 20, status: '판매중', isShow: true, isDeleted: false },
      { id: 2, color: 'Blue', size: '95', price: 1000, wholesalerOptionPrice: 1000, quantity: 10, status: '판매중지', isShow: false, isDeleted: false }
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSellerProductOptionDto)
  options: UpdateSellerProductOptionDto[];
}