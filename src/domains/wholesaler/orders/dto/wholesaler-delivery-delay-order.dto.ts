import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerDeliveryDelayOrderDetailDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  deliveryDate: string;
}

export class WholesalerDeliveryDelayOrderDto {
  @ApiProperty({ 
    example: [
      { id: 1, quantity: 10, deliveryDate: '2024/10/15' },
      { id: 2, quantity: 20, deliveryDate: '2024/10/25'  }
    ], 
    description: '주문' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerDeliveryDelayOrderDetailDto)
  orders: WholesalerDeliveryDelayOrderDetailDto[];
}