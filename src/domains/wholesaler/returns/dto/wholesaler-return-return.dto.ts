import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class WholesalerReturnReturnDto {
  @ApiProperty({ example: [1, 2], description: '반품 ID 목록' })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}