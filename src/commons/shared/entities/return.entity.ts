import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SellerProduct } from 'src/domains/seller/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/domains/seller/products/entities/seller-product-option.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';

@Entity('return')
export class Return {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: '1', description: '도매처 상품 옵션 ID' })
  @Column({ name: 'wholesaler_product_option_id' })
  wholesalerProductOptionId: number;
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @Column({ name: 'seller_product_id' })
  sellerProductId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @Column({ name: 'seller_product_option_id' })
  sellerProductOptionId: number;
  
  @ApiProperty({ example: 5, description: '주문 수량' })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: '20000', description: '금액' })
  @Column()
  price: string;
  
  @ApiProperty({ example: '대기', description: '주문 상태' })
  @Column()
  status: string;

  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  @OneToOne(() => SellerProductOption)
  @JoinColumn({ name: 'seller_product_option_id' })
  sellerProductOption: SellerProductOption;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id' })
  wholesalerProfile: WholesalerProfile;

  name: string;
  color: string;
  size: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
}