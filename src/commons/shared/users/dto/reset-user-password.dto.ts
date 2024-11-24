import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetUserPasswordDto {
  @ApiProperty({ example: 'seller',  description: '로그인 ID'})
  @IsString()
  loginId: string;

  @ApiProperty({ example: '01012345678',  description: '연락처'})
  @IsString()
  mobile: string;
}