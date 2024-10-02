import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wholesaler_profile')
export class WholesalerProfile {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({ example: '123-456-789', description: '사업자 등록번호' })
  @Column({ name: 'license_number' })
  licenseNumber: string;

  @ApiProperty({ example: '셀러1', description: '상호' })
  @Column()
  name: string;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', name: 'mall_id' })
  mallId: number;

  @ApiProperty({ example: '을지로6가', name: '상가 호수' })
  @Column({ name: 'room_no' })
  roomNo: string;

  @ApiProperty({ example: '01012345678', description: '연락처' })
  @Column()
  mobile: string;
}