import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerCreateSampleOptionAutoDto {
  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 1, description: '수량' })
  @IsNumber()
  quantity: number;
}

export class WholesalerCreateSampleAutoDto {
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @IsNumber()
  sellerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;
  /*
  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 1, description: '수량' })
  @IsNumber()
  quantity: number;
  */
  @ApiProperty({ example: '2024/10/10', description: '샘플일자' })
  @IsString()
  sampleDate: string;

  @ApiProperty({ example: '2024/10/20', description: '반납 예정일자' })
  @IsString()
  returnDate: string;

  @ApiProperty({ 
    example: [
      { wholesalerProductOptionId: 1, quantity: 20 },
      { wholesalerProductOptionId: 2, quantity: 10 },
    ], 
    description: '옵션' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerCreateSampleOptionAutoDto)
  options: WholesalerCreateSampleOptionAutoDto[];
}