import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserProfileDto {
  @ApiProperty({ example: '컴퍼니',  description: '상호'})
  @IsString()
  name: string;

  @ApiProperty({ example: '01012345677',  description: '연락처'})
  @IsString()
  mobile: string;

  @ApiProperty({ example: 1,  description: '[도매처] 상가 ID'})
  @IsOptional()
  @IsNumber()
  storeId: number;

  @ApiProperty({ example: '가',  description: '[도매처] 상가 호수'})
  @IsOptional()
  @IsString()
  roomNo: string;
}