import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class WholesalerReturnSampleDto {
  @ApiProperty({ example: [1, 2], description: '샘플 ID 목록' })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}