import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProduct } from '../../products/entities/wholesaler-product.entity';

@Entity('week_product')
export class WeekProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;
  
  @ApiProperty({ type: 'string', format: 'binary', description: '썸네일 이미지' })
  @Column({ name: 'thumbnail_image' })
  thumbnailImage: string;

  @ApiProperty({ example: 1, description: '노출 순서' })
  @Column()
  seq: number;

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  name: string;
  price: number;
  colors: any[];
  sizes: any[];
  wholesalerName: string;
}