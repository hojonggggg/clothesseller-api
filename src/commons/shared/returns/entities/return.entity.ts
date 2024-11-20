import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
//import { SellerProduct } from 'src/domains/seller/products/entities/seller-product.entity';
//import { SellerProductOption } from 'src/domains/seller/products/entities/seller-product-option.entity';
import { WholesalerProfile } from '../../users/entities/wholesaler-profile.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { SellerProfile } from '../../users/entities/seller-profile.entity';

@Entity('return')
export class Return {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: '재고상품', description: '재고상품 OR 샘플상품' })
  @Column()
  type: string;

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
  
  @ApiProperty({ example: 10000, description: '도매처 상품 금액' })
  @Column()
  price: number;
  
  @ApiProperty({ example: '불량', description: '반품 사유' })
  @Column()
  memo: string;
  
  @ApiProperty({ example: '반품신청', description: '반품 상태' })
  @Column()
  status: string;

  @ApiProperty({ example: false, description: '잔존 여부' })
  @Column({ name: 'is_credit', default: true })
  isCredit: boolean;

  @ApiProperty({ example: false, description: '수령 여부' })
  @Column({ name: 'is_receive', default: true })
  isReceive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'received_at' })
  receivedAt: Date;
  /*
  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;

  @OneToOne(() => SellerProductOption)
  @JoinColumn({ name: 'seller_product_option_id' })
  sellerProductOption: SellerProductOption;
  */
  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  @OneToOne(() => WholesalerProductOption)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  wholesalerProductOption: WholesalerProductOption;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id' })
  sellerProfile: SellerProfile;

  name: string;
  color: string;
  size: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
  sellerName: string;
  sellerMobile: string;
  deliverymanMobile: string;
  returnDate: string;
  productName: string;
  productColor: string;
  productSize: string;
  totalPrice: any;
  creditExtinctDate: string;
}