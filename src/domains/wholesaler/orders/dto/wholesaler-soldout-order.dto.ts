import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';

class WholesalerSoldoutOrderDetailDto {
  @IsNumber()
  id: number;

  @IsString()
  memo: string;
}

export class WholesalerSoldoutOrderDto {
  @ApiProperty({ 
    example: [
      { id: 1, memo: '2024/10/20 발송예정' },
      { id: 2, memo: '2024/10/30 발송예정' }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesalerSoldoutOrderDetailDto)
  orders: WholesalerSoldoutOrderDetailDto[];
}