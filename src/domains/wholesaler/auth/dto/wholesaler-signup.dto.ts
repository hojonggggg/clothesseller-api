import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class WholesalerSignupDto {
  @ApiProperty({ example: '도매처', description: '로그인 ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'test123', description: '로그인 비밀번호' })
  @IsString()
  password: string;

  @ApiProperty({ example: '123-456-789',  description: '사업자 등록번호'})
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '컴퍼니',  description: '상호'})
  @IsString()
  name: string;

  @ApiProperty({ example: '01012345677',  description: '연락처'})
  @IsString()
  mobile: string;

  @ApiProperty({ example: 1,  description: '상가 ID'})
  @IsNumber()
  storeId: number;

  @ApiProperty({ example: '가',  description: '상가 호수'})
  @IsString()
  roomNo: string;
}