import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePickupRequestDto {
  @ApiProperty({ example: 1, description: '도매처 ID' })
  @IsNumber()
  id: number;
}