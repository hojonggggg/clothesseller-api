import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRequest } from './product-request.entity';

@Entity('product_request_option')
export class ProductRequestOption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1, description: '상품 등록 요청 ID' })
  @Column({ name: 'product_request_id' })
  productRequestId: number;

  @ApiProperty({ example: 'Blue', description: '색상' })
  @Column()
  color: string;

  @ApiProperty({ example: '100', description: '사이즈' })
  @Column()
  size: string;

  @ApiProperty({ example: '10000', description: '수량' })
  @Column()
  quantity: number;

  @OneToOne(() => ProductRequest)
  @JoinColumn({ name: 'product_request_id' })
  productRequest: ProductRequest;

  productCode: string;
  wholesalerProductName: string;
  wholesalerProductPrice: number;
  sellerProductName: string;
  sellerProductPrice: number;
  status: string;
}