import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateProductDto {
  @ValidateIf((o) => o.role === 'SELLER')
  @ApiProperty({ example: '1', description: '[셀러] 판매몰 ID' })
  @IsNumber()
  storeId: number;

  @ValidateIf((o) => o.role === 'SELLER')
  @ApiProperty({ example: '1', description: '[셀러] 도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ValidateIf((o) => o.role === 'SELLER')
  @ApiProperty({ example: '1', description: '[셀러] 도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ValidateIf((o) => o.role === 'SELLER')
  @ApiProperty({ example: '10000', description: '[셀러] 도매 가격' })
  @IsNumber()
  wholesalerProductPrice: number;

  @ValidateIf((o) => o.role === 'WHOLESALER')
  @ApiProperty({ example: 'P00000IL', description: '[도매처] 상품 코드' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '상품명' })
  @IsString()
  productName: string;

  @ApiProperty({ example: '20000', description: '판매 가격' })
  @IsNumber()
  productPrice: number;

  /*
  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @IsBoolean()
  isActive: boolean;
  */
}