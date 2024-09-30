import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('seller_register_product')
export class SellerRegisterProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @Column({ name: 'product_code' })
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @Column({ name: 'wholesaler_product_name' })
  wholesalerProductName: string;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @Column({ name: 'wholesaler_product_price' })
  wholesalerProductPrice: number;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '셀러 상품명' })
  @Column({ name: 'seller_product_name' })
  sellerProductName: string;

  @ApiProperty({ example: '20000', description: '판매 가격' })
  @Column({ name: 'seller_product_price' })
  sellerProductPrice: number;

  @ApiProperty({ example: 'WAIT', description: '상품 등록 승인 상태' })
  @Column()
  status: string;
}