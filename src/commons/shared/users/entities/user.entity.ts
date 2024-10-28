import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum';
import { IsEnum } from 'class-validator';
import { WholesalerProfile } from './wholesaler-profile.entity';
import { SellerProfile } from './seller-profile.entity';

@Entity('user')
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  uid: number;

  @ApiProperty({ example: '아이디', description: '로그인 ID' })
  @Column({ name: 'login_id' })
  id: string;

  @ApiProperty({ example: 'test123', description: '로그인 PASSWORD' })
  @Column()
  password: string;

  @ApiProperty({ example: 'admin OR wholesaler OR seller', description: '사용자 권한' })
  @Column()
  @IsEnum(Role)
  role: string;

  @ApiProperty({ example: true, description: '알람 수신 여부' })
  @Column({ name: 'agree_alarm' })
  agreeAlarm: boolean;

  @OneToOne(() => WholesalerProfile)
  @JoinColumn({ name: 'id' })
  wholesalerProfile: WholesalerProfile;

  @OneToOne(() => SellerProfile)
  @JoinColumn({ name: 'id' })
  sellerProfile: SellerProfile;

  wholesalerId: number;
  sellerId: number;
  name: string;
  storeName: string;
  storeRoomNo: string;
  address: string;
  mobile: string;
}