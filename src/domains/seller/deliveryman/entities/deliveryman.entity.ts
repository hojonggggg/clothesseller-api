import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';

@Entity('deliveryman')
export class Deliveryman {
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

  @OneToOne(() => SellerProfile, (sellerProfile) => sellerProfile.deliveryman)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
}