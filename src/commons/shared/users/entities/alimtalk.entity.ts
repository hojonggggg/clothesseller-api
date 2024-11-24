import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('alimtalk')
export class Alimtalk {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: '아이디', description: '로그인 ID' })
  @Column({ name: 'login_id' })
  loginId: string;

  @ApiProperty({ example: '01012345678', description: '연락처' })
  @Column()
  mobile: string;
}