import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProductOption } from './wholesaler-product-option.entity';

@Entity('wholesaler_product')
export class WholesalerProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @Column()
  code: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '상품명' })
  @Column()
  name: string;

  @ApiProperty({ example: '10000', description: '상품 가격' })
  @Column()
  price: number;

  @ApiProperty({ example: '중국', description: '제조국' })
  @Column()
  country: string;

  @ApiProperty({ example: '면 100%', description: '혼용률' })
  @Column()
  composition: string;

  @OneToMany(() => WholesalerProductOption, (option) => option.wholesalerProduct)
  options: WholesalerProductOption[];
}