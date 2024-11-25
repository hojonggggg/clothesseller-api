import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAccountBookDto {
  @ApiProperty({ example: '2024/11/25', description: '날짜' })
  @IsString()
  date: string;

  @ApiProperty({ example: 1, description: '셀러 ID' })
  @IsNumber()
  sellerId: number;

  @ApiProperty({ example: 1000000, description: '금액' })
  @IsNumber()
  price: number;
}