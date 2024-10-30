import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class CreateProductRequestOptionDto {
  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsNumber()
  price: number;
}

export class CreateProductRequestDto {
  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;
  /*
  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @IsString()
  code: string;
  */
  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10000, description: '도매 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '중국', description: '제조국' })
  @IsString()
  country: string;

  @ApiProperty({ example: '면 100%', description: '혼용률' })
  @IsString()
  composition: string;

  @ApiProperty({ 
    example: [
      { color: 'Black', size: '95', price: 0 },
      { color: 'Blue', size: '100', price: 1000 }
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductRequestOptionDto)
  options: CreateProductRequestOptionDto[];
}