import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProduct } from './seller-product.entity';

@Entity('seller_product_option')
export class SellerProductOption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;

  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: '1', description: '셀러 상품 ID' })
  @Column({ name: 'seller_product_id' })
  sellerProductId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_option_id' })
  wholesalerProductOptionId: number;

  @ApiProperty({ example: 'Blue', description: '색상' })
  @Column()
  color: string;

  @ApiProperty({ example: '100', description: '사이즈' })
  @Column()
  size: string;

  @ApiProperty({ example: 1000, description: '옵션 가격' })
  @Column()
  price: number;

  @ApiProperty({ example: 1000, description: '도매처 옵션 가격' })
  @Column({ name: 'wholesaler_option_price' })
  wholesalerOptionPrice: number;

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @Column()
  status: string;

  @ApiProperty({ example: false, description: '상품 옵션 매칭 여부' })
  @Column({ name: 'is_matching', default: false })
  isMatching: boolean;

  @ApiProperty({ example: false, description: '상품 노출 여부' })
  @Column({ name: 'is_show', default: true })
  isShow: boolean;

  @ApiProperty({ example: false, description: '상품 반품 여부' })
  @Column({ name: 'is_returned', default: false })
  isReturned: boolean;

  @ApiProperty({ example: false, description: '상품 옵션 품절 여부' })
  @Column({ name: 'is_soldout', default: false })
  isSoldout: boolean;

  @ApiProperty({ example: false, description: '상품 옵션 삭제 여부' })
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  name: string;
  sellerPrice: number;
  wholesalerPrice: number;
  mallName: string;
  optionId: number;
  sellerProductOptionId: number;
}