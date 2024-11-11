import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WholesalerProfile } from '../../users/entities/wholesaler-profile.entity';
import { SellerProfile } from '../../users/entities/seller-profile.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from 'src/domains/wholesaler/products/entities/wholesaler-product-option.entity';
import { SellerProduct } from '../../products/entities/seller-product.entity';
import { SellerProductOption } from '../../products/entities/seller-product-option.entity';


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
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: '1', description: '셀러 주문 내역 ID' })
  @Column({ name: 'seller_order_id' })
  sellerOrderId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 ID' })
  @Column({ name: 'seller_product_id' })
  sellerProductId: number;
  
  @ApiProperty({ example: 1, description: '셀러 상품 옵션 ID' })
  @Column({ name: 'seller_product_option_id' })
  sellerProductOptionId: number;
  
  @ApiProperty({ example: 5, description: '주문 대기 수량' })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: 5, description: '총 주문 수량' })
  @Column({ name: 'quantity_total' })
  quantityTotal: number;
  
  @ApiProperty({ example: 3, description: '출고 수량' })
  @Column({ name: 'quantity_of_delivery_complete' })
  quantityOfDelivery: number;
  
  @ApiProperty({ example: 3, description: '미송 수량' })
  @Column({ name: 'quantity_of_pre_payment' })
  quantityOfPrepayment: number;
  
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
  prepaymentDate: string;
  
  @ApiProperty({ example: '2024/09/07', description: '출고예정일' })
  @Column({ name: 'delivery_date' })
  deliveryDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: false, description: '삭제 여부' })
  @Column({ name: 'is_deleted', default: true })
  isDeleted: boolean;

  @ApiProperty({ example: false, description: '삭제 여부' })
  @Column({ name: 'is_prepayment', default: true })
  isPrepayment: boolean;

  @ApiProperty({ example: false, description: '품절 여부' })
  @Column({ name: 'is_soldout', default: true })
  isSoldout: boolean;

  /*
  @ManyToOne(() => WholesalerProductOption, (productOption) => productOption.orders)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  wholesalerProductOption: WholesalerProductOption;
  */
  /*
  @ManyToOne(() => SellerProfile, (sellerProfile) => sellerProfile.orders)
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'userId' })
  sellerProfile: SellerProfile;
  */

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;

  @OneToOne(() => WholesalerProductOption)
  @JoinColumn({ name: 'wholesaler_product_option_id' })
  wholesalerProductOption: WholesalerProductOption;

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
  productName: string;
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