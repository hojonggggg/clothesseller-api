import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

class SetWeekProductDetailDto {
  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '노출 순서' })
  @IsNumber()
  seq: number;

  @ApiProperty({ example: 'product/test.jpg', description: '이미지 경로' })
  @IsString()
  imagePath: string;
}

export class SetWeekProductDto {
  @ApiProperty({ example: [{wholesalerProductId: 1, seq: 1, imagePath: 'product/test1.jpg'}, {wholesalerProductId: 2, seq: 2, imagePath: 'product/test2.png'}], description: '금주의 상품 목록' })
  @IsArray()
  products: SetWeekProductDetailDto[];
}