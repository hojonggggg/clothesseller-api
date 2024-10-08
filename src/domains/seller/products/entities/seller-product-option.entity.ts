import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProduct } from './seller-product.entity';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
//import { Order } from 'src/commons/shared/entities/order.entity';

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

  @ManyToOne(() => SellerProduct, (product) => product.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_product_id' })  // 외래 키
  sellerProduct: SellerProduct;
  /*
  @OneToMany(() => Order, (order) => order.productOption)
  orders: Order[];
  */
  name: string;
}