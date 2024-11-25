import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class CreateManualOrderDetailDto {
  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 10, description: '수량' })
  @IsNumber()
  quantity: number;

  //@IsString()
  status: string;

  //@IsString()
  orderNo: string;
}

export class CreateManualOrderDto {
  @ApiProperty({ 
    example: [
      { wholesalerId: 1, wholesalerProductId: 1, wholesalerProductOptionId: 1, quantity: 20 },
      { wholesalerId: 1, wholesalerProductId: 1, wholesalerProductOptionId: 1, quantity: 20 },
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateManualOrderDetailDto)
  orders: CreateManualOrderDetailDto[];
}