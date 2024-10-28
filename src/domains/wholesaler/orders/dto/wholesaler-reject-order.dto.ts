import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerRejectOrderDetailDto {
  @IsNumber()
  id: number;

  @IsString()
  memo: string;

  @IsNumber()
  quantity: number;
}

export class WholesalerRejectOrderDto {
  @ApiProperty({ 
    example: [
      { id: 1, quantity: 10, memo: '2024/10/20 발송예정' },
      { id: 2, quantity: 20, memo: '2024/10/30 발송예정' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerRejectOrderDetailDto)
  orders: WholesalerRejectOrderDetailDto[];
}