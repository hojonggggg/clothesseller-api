import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

class UpdateProductRequestOptionDto {
  @IsNumber()
  id: number;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsNumber()
  quantity: number;
}

export class UpdateProductRequestDto {
  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @IsString()
  wholesalerProductName: string;

  @ApiProperty({ example: '10000', description: '도매처 판매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @IsString()
  sellerProductName: string;

  @ApiProperty({ example: '20000', description: '셀러 판매 가격' })
  @IsNumber()
  sellerProductPrice: number;

  @ApiProperty({ 
    example: [
      { id: 1, color: 'Black', size: '100', quantity: 20 },
      { id: 2, color: 'Blue', size: '95', quantity: 10 }
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductRequestOptionDto)
  options: UpdateProductRequestOptionDto[];
}