import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wholesaler_product')
export class WholesalerProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @Column({ name: 'product_code' })
  productCode: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '상품명' })
  @Column({ name: 'product_name' })
  productName: string;

  @ApiProperty({ example: '10000', description: '상품 가격' })
  @Column({ name: 'product_price' })
  productPrice: number;
}