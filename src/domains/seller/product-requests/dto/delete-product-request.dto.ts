import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class DeleteProductRequestDto {
  @ApiProperty({ example: [1, 2], description: '삭제할 상품의 옵션 ID 목록' })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}