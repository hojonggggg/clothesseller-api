import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('board')
export class Board {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 'COMMON or WHOLESALER or SELLER', description: '노출 구분' })
  @Column()
  type: string;

  @ApiProperty({ example: '공지', description: '제목' })
  @Column()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', description: '썸네일 이미지' })
  @Column({ name: 'thumbnail_image' })
  thumbnailImage: string;

  @ApiProperty({ example: '공지사항 입니다.', description: '내용' })
  @Column()
  content: string;

  @ApiProperty({ example: false, description: '게시글 삭제 여부' })
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}