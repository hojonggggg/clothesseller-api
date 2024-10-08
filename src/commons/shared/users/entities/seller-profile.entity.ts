import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Deliveryman } from 'src/domains/seller/deliveryman/entities/deliveryman.entity';
import { Order } from '../../entities/order.entity';

@Entity('seller_profile')
export class SellerProfile {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({ example: '123-456-789', description: '사업자 등록번호' })
  @Column({ name: 'license_number' })
  licenseNumber: string;

  @ApiProperty({ example: '셀러1', description: '상호' })
  @Column()
  name: string;

  @ApiProperty({ example: '동대문구', name: '구' })
  @Column()
  address1: string;

  @ApiProperty({ example: '장안동', name: '동' })
  @Column()
  address2: string;

  @ApiProperty({ example: '01012345678', description: '연락처' })
  @Column()
  mobile: string;

  @OneToOne(() => Deliveryman, (deliveryman) => deliveryman.sellerProfile)
  deliveryman: Deliveryman;

  @OneToMany(() => Order, (order) => order.sellerProfile)
  orders: Order[];
}