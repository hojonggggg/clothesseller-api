import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWeekProductDto {
  @ApiProperty({ example: '1', description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '썸네일 이미지 파일',
  })
  thumbnailImage: any;

  @ApiProperty({ example: '1', description: '노출 순서' })
  @IsNumber()
  seq: number;
}