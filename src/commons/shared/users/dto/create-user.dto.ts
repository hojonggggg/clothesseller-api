import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, ValidateIf } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: '아이디', description: '로그인 ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'test123', description: '로그인 비밀번호' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'seller',
    description: 'admin OR wholesaler OR seller',
    enum: Role,
    enumName: 'Role',
  })
  @IsEnum(Role, { message: 'admin | wholesaler | seller' })
  role: Role;

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
  @ValidateIf(o => o.role === Role.WHOLESALER)
  @IsNumber()
  //@IsOptional()
  mallId: number;

  @ApiProperty({ example: '가',  description: '상가 호수'})
  @ValidateIf(o => o.role === Role.WHOLESALER)
  @IsString()
  roomNo: string;

  @ApiProperty({ example: '중구',  description: '구'})
  @ValidateIf(o => o.role === Role.SELLER)
  @IsString()
  //@IsOptional()
  address1: string;

  @ApiProperty({ example: '을지로6가',  description: '동'})
  @ValidateIf(o => o.role === Role.SELLER)
  @IsString()
  //@IsOptional()
  address2: string;
}