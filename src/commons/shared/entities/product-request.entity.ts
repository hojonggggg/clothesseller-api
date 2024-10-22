import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRequestOption } from './product-request-option.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { SellerProfile } from '../users/entities/seller-profile.entity';

@Entity('product_request')
export class ProductRequest {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: 'P00000IL', description: '상품 코드' })
  @Column({ name: 'code' })
  code: string;

  @ApiProperty({ example: '머슬핏 컴포트 반팔 니트', description: '도매처 상품명' })
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({ example: 10000, description: '도매 가격' })
  @Column({ name: 'price' })
  price: number;

  @ApiProperty({ example: '중국', description: '제조국' })
  @Column()
  country: string;

  @ApiProperty({ example: '면 100%', description: '혼용률' })
  @Column()
  composition: string;
  
  @ApiProperty({ example: '승인대기', description: '상품 등록 승인 상태' })
  @Column()
  status: string;
  
  @ApiProperty({ example: false, description: '상품 요청 삭제 여부' })
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @OneToMany(() => ProductRequestOption, (option) => option.productRequest)
  options: ProductRequestOption[];

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id', referencedColumnName: 'userId' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;

  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerRoomNo: string;
  sellerName: string;
}