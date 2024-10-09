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

  @ApiProperty({ example: 'Blue', description: '색상' })
  @Column()
  color: string;

  @ApiProperty({ example: '100', description: '사이즈' })
  @Column()
  size: string;

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  name: string;
  sellerPrice: number;
  wholesalerPrice: number;
  mallName: string;
}