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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}