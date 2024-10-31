import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class WholesalerCreatePrepaymentOptionDto {
  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 1, description: '수량' })
  @IsNumber()
  quantity: number;
}

export class WholesalerCreatePrepaymentDto {
  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;
  
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @IsOptional()
  @IsNumber()
  sellerId: number;

  @ApiProperty({ example: '2024/10/10', description: '미송일자' })
  @IsString()
  prepaymentDate: string;

  @ApiProperty({ example: '2024/10/10', description: '출고예정일자' })
  @IsString()
  deliveryDate: string;

  @ApiProperty({ 
    example: [
      { wholesalerProductOptionId: 1, quantity: 20 },
      { wholesalerProductOptionId: 2, quantity: 10 },
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerCreatePrepaymentOptionDto)
  options: WholesalerCreatePrepaymentOptionDto[];
}