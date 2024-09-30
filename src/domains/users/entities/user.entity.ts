import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  uid: number;

  @ApiProperty({ example: 'seller', description: '로그인 ID' })
  @Column({ name: 'login_id' })
  id: string;

  @ApiProperty({ example: 'test123', description: '로그인 PASSWORD' })
  @Column()
  password: string;

  @ApiProperty({ example: 'admin OR wholesaler OR seller', description: '사용자 권한' })
  @Column()
  role: string;
}