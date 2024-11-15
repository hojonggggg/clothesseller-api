import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProfile } from '../../users/entities/seller-profile.entity';
import { SellerProduct } from '../../products/entities/seller-product.entity';
import { SellerProductOption } from '../../products/entities/seller-product-option.entity';
import { WholesalerProfile } from '../../users/entities/wholesaler-profile.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { Mall } from '../../malls/entities/mall.entity';

@Entity('seller_order')
export class SellerOrder {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @Column({ name: 'seller_product_id' })
  sellerProductId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @Column({ name: 'seller_product_option_id' })
  sellerProductOptionId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_option_id' })
  wholesalerProductOptionId: number;
  
  @ApiProperty({ example: 5, description: '주문 수량' })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;
  
  @ApiProperty({ example: '상품준비중', description: '주문 상태' })
  @Column()
  status: string;

  @ApiProperty({ example: false, description: '매칭 여부' })
  @Column({ name: 'is_matching', default: true })
  isMatching: boolean;

  @ApiProperty({ example: false, description: '발주 여부' })
  @Column({ name: 'is_ordering', default: true })
  isOrdering: boolean;

  @ApiProperty({ example: false, description: '삭제 여부' })
  @Column({ name: 'is_deleted', default: true })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  //@ManyToOne(() => SellerProduct, (productOption) => productOption.sellerOrders)
  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  @OneToOne(() => SellerProductOption)
  @JoinColumn({ name: 'seller_product_option_id', referencedColumnName: 'id' }) // store_id를 이용해 store와 연결
  sellerProductOption: SellerProductOption;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id' })
  sellerProfile: SellerProfile;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  @OneToOne(() => Mall)
  @JoinColumn({ name: 'mall_id', referencedColumnName: 'id' }) // store_id를 이용해 store와 연결
  mall: Mall;

  name: string;
  color: string;
  size: string;
  wholesalerProductName: string;
  mallName: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
  productName: string;
  sellerName: string;
  price: number;
  totalPrice: number;
}