import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'seller', description: '사용자 ID' })
  id: string;

  @ApiProperty({ example: 'test123', description: '사용자 비밀번호' })
  @IsString()
  password: string;
}