import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { SellerProductOption } from './seller-product-option.entity';

@Entity('seller_product')
export class SellerProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: '1', description: '판매몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: '20000', description: '셀러 상품명' })
  @Column()
  name: string;

  @ApiProperty({ example: '20000', description: '판매 가격' })
  @Column()
  price: number;

  @ApiProperty({ example: '10000', description: '도매 가격' })
  @Column({ name: 'wholesaler_product_price' })
  wholesalerProductPrice: number;

  @ApiProperty({ example: false, description: '상품 판매 상태' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => SellerOrder, (order) => order.sellerProduct)
  sellerOrders: SellerOrder[];

  @OneToMany(() => SellerProductOption, (option) => option.sellerProduct)
  options: SellerProductOption[];
}