import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { SellerProfile } from '../users/entities/seller-profile.entity';

@Entity('tax_invoice')
export class TaxInvoice {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;
  
  @ApiProperty({ example: '1000000', description: '금액' })
  @Column()
  amount: string;

  @ApiProperty({ example: '123-456-789', description: '사업자 등록번호' })
  @Column({ name: 'license_number' })
  licenseNumber: string;

  @ApiProperty({ example: 'test@gmail.com', description: '이메일' })
  @Column()
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id' })
  sellerProfile: SellerProfile;
  
  wholesalerName: string;
}