import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { SellerProductOption } from 'src/domains/seller/products/entities/seller-product-option.entity';
import { SellerProfile } from '../users/entities/seller-profile.entity';


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

  @ApiProperty({ example: '1', description: '셀러 상품 옵션 ID' })
  @Column({ name: 'seller_product_option_id' })
  sellerProductOptionId: number;
  
  @ApiProperty({ example: '2024/08/08', description: '샘플일자' })
  @Column({ name: 'sample_date' })
  sampleDate: string;
  
  @ApiProperty({ example: '2024/08/13', description: '반납예정일자' })
  @Column({ name: 'return_date' })
  returnDate: string;
  
  @ApiProperty({ example: '대기', description: '주문 상태' })
  @Column()
  status: string;

  @ManyToOne(() => WholesalerProductOption, (productOption) => productOption.orders)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  wholesalerProductOption: WholesalerProductOption;
  /*
  @ManyToOne(() => WholesalerProfile, (wholesalerProfile) => wholesalerProfile.orders)
  @JoinColumn({ name: 'wholesaler_id', referencedColumnName: 'userId' })
  wholesalerProfile: WholesalerProfile;
  */
  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id', referencedColumnName: 'userId' })
  wholesalerProfile: WholesalerProfile;
  /*
  @ManyToOne(() => SellerProfile, (sellerProfile) => sellerProfile.orders)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
  */
  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
  /*
  @ManyToOne(() => SellerProductOption, (productOption) => productOption.orders)
  @JoinColumn({ name: 'seller_product_option_id' })
  sellerProductOption: SellerProductOption;
  */
  @OneToOne(() => SellerProductOption)
  @JoinColumn({ name: 'seller_product_option_id', referencedColumnName: 'id' }) // store_id를 이용해 store와 연결
  sellerProductOption: SellerProductOption;

  name: string;
  color: string;
  size: string;
  quantity: number;
  sellerName: string;
  sellerAddress: string;
  sellerMobile: string;
  deliverymanMobile: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
}