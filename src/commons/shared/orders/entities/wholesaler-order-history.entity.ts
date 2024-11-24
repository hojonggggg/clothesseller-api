import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wholesaler_order_history')
export class WholesalerOrderHistory {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ example: '1', description: '주문 ID' })
  @Column({ name: 'wholesaler_order_id' })
  wholesalerOrderId: number;
  
  @ApiProperty({ example: 'confirm', description: '유형' })
  @Column()
  action: string;
  
  @ApiProperty({ example: 5, description: '주문 대기 수량' })
  @Column()
  quantity: number;
  
  @ApiProperty({ example: '1', description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @ApiProperty({ example: '1', description: '도매처 ID' })
  @Column({ name: 'wholesaler_id' })
  wholesalerId: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', name: 'store_id' })
  storeId: number;

  @ApiProperty({ example: '을지로6가', name: '상가 호수' })
  @Column({ name: 'room_no' })
  roomNo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}