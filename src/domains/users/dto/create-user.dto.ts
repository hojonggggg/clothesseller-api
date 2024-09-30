import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'seller', description: 'The id of the user' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'test123', description: 'The password of the user' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'seller',
    description: 'admin OR wholesaler OR seller',
    enum: Role,
    enumName: 'Role',
  })
  @IsEnum(Role, { message: 'Type must be either admin or wholesaler or seller' })
  role: Role;
}