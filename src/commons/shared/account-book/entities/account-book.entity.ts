import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProfile } from '../../users/entities/seller-profile.entity';

@Entity('account_book')
export class AccountBook {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: '2024/11/25', description: '날짜' })
  @Column()
  date: string;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: 2000000, description: '결제 금액' })
  @Column()
  price: number;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
}