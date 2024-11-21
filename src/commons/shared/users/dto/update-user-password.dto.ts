import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'abc123!@#',  description: '비밀번호'})
  @IsString()
  password: string;

  @ApiProperty({ example: 'abc123!@#',  description: '일치 확인 비밀번호'})
  @IsString()
  confirmPassword: string;
}