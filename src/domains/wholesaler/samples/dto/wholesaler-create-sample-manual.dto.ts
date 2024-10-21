import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class WholesalerCreateSampleManualDto {
  @ApiProperty({ example: '셀러', description: '셀러 업체명' })
  @IsString()
  sellerName: string;

  @ApiProperty({ example: '동대문구 장안동', description: '셀러 주소' })
  @IsString()
  sellerAddress: string;

  @ApiProperty({ example: '01012345678', description: '셀러 연락처' })
  @IsString()
  sellerMobile: string;

  @ApiProperty({ example: '01012345678', description: '사입삼촌 연락처' })
  @IsString()
  deliverymanMobile: string;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @IsNumber()
  wholesalerProductId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 옵션 ID' })
  @IsNumber()
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 1, description: '수량' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '2024/10/10', description: '샘플일자' })
  @IsString()
  sampleDate: string;

  @ApiProperty({ example: '2024/10/20', description: '반납 예정일자' })
  @IsString()
  returnDate: string;
}