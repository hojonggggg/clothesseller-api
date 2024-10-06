import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProduct } from './wholesaler-product.entity';

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

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @ManyToOne(() => WholesalerProduct, (product) => product.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wholesaler_product_id' })  // 외래 키
  wholesalerProduct: WholesalerProduct;

  name: string;
}