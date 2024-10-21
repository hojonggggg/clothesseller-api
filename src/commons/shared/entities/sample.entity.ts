import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProfile } from '../users/entities/seller-profile.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';


@Entity('sample')
export class Sample {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: 'AUTO', description: '셀러 타입' })
  @Column({ name: 'seller_type' })
  sellerType: string;
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: '셀러', description: '셀러 업체명' })
  @Column({ name: 'seller_name' })
  sellerName: string;

  @ApiProperty({ example: '동대문구 장안동', name: '셀러 주소' })
  @Column({ name: 'seller_address' })
  sellerAddress: string;

  @ApiProperty({ example: '01012345678', description: '셀러 연락처' })
  @Column({ name: 'seller_mobile' })
  sellerMobile: string;

  @ApiProperty({ example: '01012345678', description: '사입삼촌 연락처' })
  @Column({ name: 'seller_deliveryman_mobile' })
  deliverymanMobile: string;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: '1', description: '셀러 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_option_id' })
  wholesalerProductOptionId: number;
  
  @ApiProperty({ example: 17, description: '수량' })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: '2024/08/08', description: '샘플일자' })
  @Column({ name: 'sample_date' })
  sampleDate: string;
  
  @ApiProperty({ example: '2024/08/13', description: '반납예정일자' })
  @Column({ name: 'return_date' })
  returnDate: string;
  
  @ApiProperty({ example: '대기', description: '주문 상태' })
  @Column()
  status: string;

  @ApiProperty({ example: false, description: '삭제 여부' })
  @Column({ name: 'is_deleted', default: true })
  isDeleted: boolean;

  @ApiProperty({ example: false, description: '반납 여부' })
  @Column({ name: 'is_returned', default: true })
  isReturned: boolean;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id', referencedColumnName: 'userId' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  @OneToOne(() => WholesalerProductOption)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  wholesalerProductOption: WholesalerProductOption;

  name: string;
  color: string;
  size: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
}