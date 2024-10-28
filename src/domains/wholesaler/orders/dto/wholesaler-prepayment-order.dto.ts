import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerPrepaymentOrderDetailDto {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;

  @IsString()
  prepaymentDate: string;

  @IsString()
  deliveryDate: string;
}

export class WholesalerPrepaymentOrderDto {
  @ApiProperty({ 
    example: [
      { id: 1, quantity: 10, prepaymentDate: '2024/10/10', deliveryDate: '2024/10/15' },
      { id: 2, quantity: 20, prepaymentDate: '2024/10/20', deliveryDate: '2024/10/25'  }
    ], 
    description: '주문' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerPrepaymentOrderDetailDto)
  orders: WholesalerPrepaymentOrderDetailDto[];
}