import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProduct } from './wholesaler-product.entity';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';

@Entity('wholesaler_product_option')
export class WholesalerProductOption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: 'Blue', description: '색상' })
  @Column()
  color: string;

  @ApiProperty({ example: '100', description: '사이즈' })
  @Column()
  size: string;

  @ApiProperty({ example: '1000', description: '상품 옵션 가격' })
  @Column()
  price: number;

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @ApiProperty({ example: false, description: '상품 옵션 삭제 여부' })
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;
  
  @ManyToOne(() => WholesalerProduct, (product) => product.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wholesaler_product_id' })  // 외래 키
  wholesalerProduct: WholesalerProduct;

  @OneToMany(() => WholesalerOrder, (order) => order.productOption)
  orders: WholesalerOrder[];

  code: string;
  name: string;
  wholesalerProductOptionId: number;
  optionId: number;
  optionPrice: string;
}