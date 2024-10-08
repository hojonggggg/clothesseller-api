import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { SellerProfile } from '../users/entities/seller-profile.entity';
import { Deliveryman } from 'src/domains/seller/deliveryman/entities/deliveryman.entity';


@Entity('sample')
export class Sample {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_option_id' })
  wholesalerProductOptionId: number;
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: '2024/08/08', description: '샘플일자' })
  @Column({ name: 'start_date' })
  startDate: string;
  
  @ApiProperty({ example: '2024/08/13', description: '반납예정일자' })
  @Column({ name: 'end_date' })
  endDate: string;
  
  @ApiProperty({ example: '대기', description: '주문 상태' })
  @Column()
  status: string;

  @ManyToOne(() => WholesalerProductOption, (productOption) => productOption.orders)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  productOption: WholesalerProductOption;

  @ManyToOne(() => SellerProfile, (sellerProfile) => sellerProfile.orders)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;

  name: string;
  color: string;
  size: string;
  quantity: number;
  sellerName: string;
  sellerAddress: string;
  sellerMobile: string;
  deliverymanMobile: string;
}