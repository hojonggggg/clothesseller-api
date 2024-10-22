import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @ApiProperty({ example: 1000, description: '상품 옵션 가격' })
  @Column()
  price: number;
  /*
  @ApiProperty({ example: true, description: '상품 요청 승인 여부' })
  @Column({ name: 'is_approve', default: true })
  isApprove: boolean;
  */
  @ApiProperty({ example: false, description: '상품 요청 옵션 삭제 여부' })
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @ManyToOne(() => ProductRequest, (request) => request.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_request_id' })  // 외래 키
  productRequest: ProductRequest;


  name: string;
  optionId: number;
  ////
  productCode: string;
  wholesalerProductName: string;
  wholesalerProductPrice: number;
  sellerProductName: string;
  sellerProductPrice: number;
}