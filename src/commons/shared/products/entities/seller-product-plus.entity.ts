import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
//import { Mall } from '../../malls/entities/mall.entity';
//import { SellerProduct } from './seller-product.entity';
//import { SellerProductOption } from './seller-product-option.entity';

@Entity('seller_product_plus')
export class SellerProductPlus {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @Column({ name: 'seller_product_id' })
  sellerProductId: number;

  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @Column({ name: 'seller_product_option_id' })
  sellerProductOptionId: number;

  @ApiProperty({ example: 1, description: '추가 상품 ID' })
  @Column({ name: 'plus_product_id' })
  plusProductId: number;

  @ApiProperty({ example: 1, description: '추가 상품 옵션 ID' })
  @Column({ name: 'plus_product_option_id' })
  plusProductOptionId: number;
}