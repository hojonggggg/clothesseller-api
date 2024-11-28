import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mall } from '../../malls/entities/mall.entity';
import { SellerProductOption } from './seller-product-option.entity';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';
import { WholesalerProfile } from 'src/commons/shared/users/entities/wholesaler-profile.entity';
import { SellerOrder } from 'src/commons/shared/orders/entities/seller-order.entity';
import { SellerProfile } from 'src/commons/shared/users/entities/seller-profile.entity';

@Entity('seller_product')
export class SellerProduct {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: 1, description: '판매몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;

  @ApiProperty({ example: 1, description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 1, description: '도매처 상품 ID' })
  @Column({ name: 'wholesaler_product_id' })
  wholesalerProductId: number;

  @ApiProperty({ example: '후드', description: '셀러 상품명' })
  @Column()
  name: string;

  @ApiProperty({ example: 20000, description: '판매 가격' })
  @Column()
  price: number;

  @ApiProperty({ example: false, description: '상품 매칭 여부' })
  @Column({ name: 'is_matching', default: false })
  isMatching: boolean;

  @ApiProperty({ example: 10000, description: '도매 가격' })
  @Column({ name: 'wholesaler_product_price' })
  wholesalerProductPrice: number;

  @ApiProperty({ example: '2024/11/25', description: '쇼핑몰 상품 등록일' })
  @Column({ name: 'reg_date' })
  regDate: string;

  @OneToOne(() => Mall)
  @JoinColumn({ name: 'mall_id' })
  mall: Mall;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'wholesaler_id' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'seller_id' })
  sellerProfile: SellerProfile;

  @OneToOne(() => WholesalerProduct)
  @JoinColumn({ name: 'wholesaler_product_id' })
  wholesalerProduct: WholesalerProduct;
  /*
  @OneToMany(() => SellerOrder, (order) => order.sellerProduct)
  sellerOrders: SellerOrder[];
  */
  @OneToMany(() => SellerProductOption, (option) => option.sellerProduct)
  sellerProductOptions: SellerProductOption[];

  wholesalerName: string;
  wholesalerStoreName: string;
  wholesalerStoreRoomNo: string;
  wholesalerMobile: string;
  mallName: string;
  wholesalerProductCode: string;
  sellerName: string;
  color: string;
  size: string;
}