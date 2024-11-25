import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class ProductMatchingOptionDto {
  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @IsNumber()
  sellerProductId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @IsNumber()
  sellerProductOptionId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 10000, description: '도매처 상품 가격' })
  @IsNumber()
  wholesalerProductPrice: number;
}

export class ProductMatchingDto {
  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @IsNumber()
  mallId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @IsNumber()
  sellerProductId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @IsNumber()
  sellerProductOptionId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 10000, description: '도매처 상품 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ApiProperty({ 
    example: [
      { sellerProductId: 1, sellerProductOptionId: 1, wholesalerId: 1, wholesalerProductId: 1, wholesalerProductOptionId: 1, wholesalerProductPrice: 20000 },
      { sellerProductId: 1, sellerProductOptionId: 1, wholesalerId: 1, wholesalerProductId: 1, wholesalerProductOptionId: 1, wholesalerProductprice: 10000 },
    ], 
    description: '상세' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductMatchingOptionDto)
  options: ProductMatchingOptionDto[];
}