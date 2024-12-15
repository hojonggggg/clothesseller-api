import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mall } from '../../malls/entities/mall.entity';

@Entity('seller_api')
export class SellerApi {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  
  @ApiProperty({ example: 1, description: '셀러 ID' })
  @Column({ name: 'seller_id' })
  sellerId: number;
  
  @ApiProperty({ example: 1, description: '쇼핑몰 ID' })
  @Column({ name: 'mall_id' })
  mallId: number;
  
  @ApiProperty({ description: '쇼핑몰 API ID' })
  @Column({ name: 'client_id' })
  clientId: string;
  
  @ApiProperty({ description: '쇼핑몰 API SECRET' })
  @Column({ name: 'client_secret' })
  clientSecret: string;

  @OneToOne(() => Mall)
  @JoinColumn({ name: 'mall_id' })
  mall: Mall;

}