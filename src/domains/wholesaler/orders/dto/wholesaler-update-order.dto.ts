import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerUpdateOrderDetailDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}

export class WholesalerUpdateOrderDto {
  @ApiProperty({ 
    example: [
      { id: 1, quantity: 10 },
      { id: 2, quantity: 20 }
    ], 
    description: '주문' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerUpdateOrderDetailDto)
  orders: WholesalerUpdateOrderDetailDto[];
}