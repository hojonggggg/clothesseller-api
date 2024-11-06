import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'COMMON or WHOLESALER or SELLER', description: '노출 구분' })
  type: string;

  @ApiProperty({ example: '공지', description: '제목' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '썸네일 이미지 파일',
  })
  thumbnailImage: any;

  @ApiProperty({ example: '공지사항 입니다.', description: '내용' })
  content: string;
}
