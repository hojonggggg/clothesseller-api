import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { WholesalerProfile } from '../users/entities/wholesaler-profile.entity';
import { SellerProfile } from '../users/entities/seller-profile.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { SellerProduct } from 'src/domains/seller/products/entities/seller-product.entity';
import { SellerProductOption } from 'src/domains/seller/products/entities/seller-product-option.entity';


@Entity('wholesaler_order')
export class WholesalerOrder {
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
  
  @ApiProperty({ example: '1', description: '셀러 주문 내역 ID' })
  @Column({ name: 'seller_order_id' })
  sellerOrderId: number;
  
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
  
  @ApiProperty({ example: '자동', description: '주문 유형' })
  @Column({ name: 'order_type' })
  orderType: string;
  
  @ApiProperty({ example: '2024/08/24 발송예정', description: '메모' })
  @Column()
  memo: string;
  
  @ApiProperty({ example: '대기', description: '주문 상태' })
  @Column()
  status: string;
  
  @ApiProperty({ example: '2024/08/15', description: '미송일자' })
  @Column({ name: 'pre_payment_date' })
  prePaymentDate: string;
  
  @ApiProperty({ example: '2024/09/07', description: '출고예정일' })
  @Column({ name: 'delivery_date' })
  deliveryDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => WholesalerProductOption, (productOption) => productOption.orders)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  productOption: WholesalerProductOption;
  /*
  @ManyToOne(() => SellerProfile, (sellerProfile) => sellerProfile.orders)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
  */

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id', referencedColumnName: 'userId' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;

  @OneToOne(() => SellerProduct)
  @JoinColumn({ name: 'seller_product_id' })
  sellerProduct: SellerProduct;
  
  @OneToOne(() => SellerProductOption)
  @JoinColumn({ name: 'seller_product_option_id', referencedColumnName: 'id' }) // store_id를 이용해 store와 연결
  sellerProductOption: SellerProductOption;

  //seller-order.entity
  sellerProductName: string;
  sellerProductColor: string;
  sellerProductSize: string;
  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;

  name: string;
  color: string;
  size: string;
  //quantity: number;
  sellerName: string;
  sellerMobile: string;
  deliverymanMobile: string;
  /*
  @ManyToOne(() => Deliveryman, (deliveryman) => deliveryman.orders)
  @JoinColumn({ name: 'seller_id' })
  deliveryman: Deliveryman;
  */

}