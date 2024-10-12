import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class SellerSignupDto {
  @ApiProperty({ example: '셀러', description: '로그인 ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'test123', description: '로그인 비밀번호' })
  @IsString()
  password: string;

  @ApiProperty({ example: true, description: '알람 수신동의 여부' })
  @IsBoolean()
  agreeAlarm: string;

  @ApiProperty({ example: '123-456-789',  description: '사업자 등록번호'})
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '컴퍼니',  description: '상호'})
  @IsString()
  name: string;

  @ApiProperty({ example: '01012345677',  description: '연락처'})
  @IsString()
  mobile: string;

  @ApiProperty({ example: '동대문구',  description: '구'})
  @IsString()
  address1: string;

  @ApiProperty({ example: '장안동',  description: '동'})
  @IsString()
  address2: string;
}