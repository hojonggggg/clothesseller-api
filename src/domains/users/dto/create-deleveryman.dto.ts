import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDeleverymanDto {
  @ApiProperty({ example: '사입삼촌', description: '사입삼촌명' })
  @IsString()
  name: string;

  @ApiProperty({ example: '01012345678', description: '사입삼촌 연락처' })
  @IsString()
  mobile: string;
}