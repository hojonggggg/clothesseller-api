import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from 'src/domains/wholesaler/stores/entities/store.entity';

@Entity('wholesaler_profile')
export class WholesalerProfile {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({ example: '123-456-789', description: '사업자 등록번호' })
  @Column({ name: 'license_number' })
  licenseNumber: string;

  @ApiProperty({ example: '셀러1', description: '상호' })
  @Column()
  name: string;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  @ApiProperty({ example: '을지로6가', name: '상가 호수' })
  @Column({ name: 'room_no' })
  roomNo: string;

  @ApiProperty({ example: '01012345678', description: '연락처' })
  @Column()
  mobile: string;

  @OneToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;
  
  wholesalerId: number;
  storeName: string;
  /*
  @OneToMany(() => Order, (order) => order.sellerProfile)
  orders: Order[];
  */
}