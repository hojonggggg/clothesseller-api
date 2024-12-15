import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSellerApiDto {
  @ApiProperty({ example: 1, description: '쇼핑몰 ID' })
  @IsNumber()
  mallId: number;

  @ApiProperty({ example: 'abcdefg', description: 'API Client ID' })
  @IsString()
  clientId: string;

  @ApiProperty({ example: '$@#%.d', description: 'API Client Secret' })
  @IsString()
  clientSecret: string;
}