import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class CreateProductPlusDetailDto {
  @ApiProperty({ example: 1, description: '판매처 ID' })
  @IsNumber()
  mallId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @IsNumber()
  sellerProductId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @IsNumber()
  sellerProductOptionId: number;

  @ApiProperty({ example: 1, description: '추가 상품 ID' })
  @IsNumber()
  plusProductId: number;

  @ApiProperty({ example: 1, description: '추가 상품 옵션 ID' })
  @IsNumber()
  plusProductOptionId: number;
}

export class CreateProductPlusDto {
  @ApiProperty({ 
    example: [
      { mallId: 1, sellerProductId: 1, sellerProductOptionId: 1, plusProductId: 1, plusProductOptionId: 1 },
      { mallId: 1, sellerProductId: 1, sellerProductOptionId: 1, plusProductId: 1, plusProductOptionId: 1 },
    ], 
    description: '상세' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductPlusDetailDto)
  options: CreateProductPlusDetailDto[];
}