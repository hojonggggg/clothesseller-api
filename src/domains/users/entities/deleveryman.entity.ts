import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('deliveryman')
export class Deleveryman {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 'seller', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: '사입삼촌', description: '사입삼촌명' })
  @Column()
  name: string;

  @ApiProperty({ example: '01012345678', description: '사입삼촌 연락처' })
  @Column()
  mobile: string;
}