import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProduct } from './seller-product.entity';

@Entity('seller_product_option')
export class SellerProductOption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

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

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @Column()
  status: string;

  @ApiProperty({ example: false, description: '상품 노출 여부' })
  @Column({ name: 'is_show', default: true })
  isShow: boolean;

  @ApiProperty({ example: false, description: '상품 반품 상태' })
  @Column({ name: 'is_return', default: false })
  isReturn: boolean;

  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  name: string;
  sellerPrice: number;
  wholesalerPrice: number;
  mallName: string;
}