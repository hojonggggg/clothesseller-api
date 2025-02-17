import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Store } from 'src/domains/wholesaler/stores/entities/store.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import * as bcrypt from 'bcrypt';
import { Alimtalk } from './entities/alimtalk.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WholesalerProfile)
    private wholesalerProfileRepository: Repository<WholesalerProfile>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>,
    //@InjectRepository(Store)
    //private storeRepository: Repository<Store>,
    @InjectRepository(Alimtalk)
    private alimtalkProfileRepository: Repository<Alimtalk>,
  ) {}

  async createUser(createUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userRepository.save(createUserDto);
      delete(user.password);
      const userId = Number(user.uid);
      const { role } = createUserDto;
      if (role === 'ADMIN') {

      } else if (role === 'WHOLESALER') {
        await this.createWholesalerProfile(userId, createUserDto);
      } else if (role === 'SELLER') {
        await this.createSellerProfile(userId, createUserDto);
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  async createWholesalerProfile(userId: number, createUserDto: CreateUserDto) {
    const wholesalerProfile = this.wholesalerProfileRepository.create({
      userId,
      ...createUserDto
    });
    await this.wholesalerProfileRepository.save(wholesalerProfile);
  }
  
  async createSellerProfile(userId: number, createUserDto: CreateUserDto) {
    const sellerProfile = this.sellerProfileRepository.create({
      userId,
      ...createUserDto
    });
    await this.sellerProfileRepository.save(sellerProfile);
  }

  async me(userId: number, role: string) {
    if (role === 'WHOLESALER') {
      /*
      return await this.wholesalerProfileRepository.findOne({ 
        select: ['name', 'mobile', 'roomNo'],
        
        where: { userId } 
      });
      */
      return await this.wholesalerProfileRepository.createQueryBuilder('wp')
        .select([
          'wp.licenseNumber AS licenseNumber',
          'wp.name AS name',
          'wp.mobile AS mobile',
          'wp.roomNo AS roomNo',
          'store.id AS storeId',
          'store.name AS storeName',
        ])
        .leftJoin('wp.store', 'store') // storeId를 기준으로 조인
        .where('wp.userId = :userId', { userId })
        .getRawOne();
    } else if (role === 'SELLER') {
      return await this.sellerProfileRepository.findOne({ 
        select: ['licenseNumber', 'name', 'mobile', 'address1', 'address2'],
        where: { userId } 
      });
    }
  }

  async updateMe(userId: number, role: string, updateUserProfileDto: UpdateUserProfileDto) {
    if (role === 'WHOLESALER') {
      return await this.wholesalerProfileRepository.update(
        { userId }, 
        { ...updateUserProfileDto }
      );
    } else if (role === 'SELLER') {
      return await this.sellerProfileRepository.update(
        { userId }, 
        { ...updateUserProfileDto }
      );
    }
  }

  async updatePassword(userId: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { password, confirmPassword } = updateUserPasswordDto;
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호를 확인해주세요.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(
      { uid: userId },
      { password: hashedPassword}
    );
  }

  async resetPasswrod(resetUserPasswordDto: ResetUserPasswordDto) {
    const { loginId, mobile } = resetUserPasswordDto;
    let userProfile;
    const userInfo = await this.userRepository.findOne({ where: { id: loginId } });
    if (userInfo) {
      console.log({userInfo});
      const { uid, role } = userInfo;
      console.log({uid, role});
      
      
      if (role === 'SELLER') {
        userProfile = await this.sellerProfileRepository.findOne({ where: { userId: uid, mobile } });
      } else if (role === 'WHOLESALER') {
        userProfile = await this.wholesalerProfileRepository.findOne({ where: { userId: uid, mobile } });
      }

      if (userProfile) {
        await this.alimtalkProfileRepository.save({
          loginId,
          mobile
        });
      }
    } 
    
    if (!userInfo || !userProfile) {
      throw new BadRequestException('입력 정보를 확인해주세요.');
    }
  }

  async findOneUserById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAllWholesaler(query: string) {
    const queryBuilder = this.wholesalerProfileRepository.createQueryBuilder('wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store');

    if (query) {
      queryBuilder.andWhere('wholesalerProfile.name LIKE :query', { query: `%${query}%` });
    }

    const wholesalers = await queryBuilder.getMany();
    
    for (const wholesaler of wholesalers) {
      wholesaler.wholesalerId = wholesaler.userId;
      wholesaler.storeName = wholesaler.store.name;

      delete(wholesaler.userId);
      delete(wholesaler.licenseNumber);
      delete(wholesaler.store);
    }

    return wholesalers;
  }

  async findAllWholesalerWithPagination(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('user.role = :role', { role: 'WHOLESALER' });
    
    if (query) {
      queryBuilder.andWhere('wholesalerProfile.name LIKE :query', { query: `%${query}%` });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.uid', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const user of users) {
      user.wholesalerId = user.wholesalerProfile.userId;
      user.name = user.wholesalerProfile.name;
      user.storeName = user.wholesalerProfile.store.name;
      user.storeRoomNo = user.wholesalerProfile.roomNo;
      user.mobile = user.wholesalerProfile.mobile;

      delete(user.uid);
      delete(user.id);
      delete(user.password);
      delete(user.role);
      delete(user.agreeAlarm);
      delete(user.wholesalerProfile);
    }

    return {
      list: users,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneWholesaler(wholesalerId: number) {
    const queryBuilder = this.wholesalerProfileRepository.createQueryBuilder('wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('wholesalerProfile.userId = :wholesalerId', { wholesalerId });

    const wholesaler = await queryBuilder.getOne();
    //wholesaler.storeName = wholesaler.store.name;
    //delete(wholesaler.storeId);
    delete(wholesaler.store);

    return wholesaler;
  }

  async findAllSeller(query: string) {
    const queryBuilder = this.sellerProfileRepository.createQueryBuilder('sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')

    if (query) {
      queryBuilder.andWhere('sellerProfile.name LIKE :query', { query: `%${query}%` });
    }

    const sellers = await queryBuilder
      .orderBy('sellerProfile.name', 'ASC')
      .getMany();
    
    for (const seller of sellers) {
      seller.sellerId = seller.userId;
      const { address1, address2 } = seller;
      seller.address = address1 + " " + address2;
      seller.deliverymanMobile = null;
      if (seller.deliveryman) {
        seller.deliverymanMobile = seller.deliveryman.mobile;
      }

      delete(seller.userId);
      delete(seller.licenseNumber);
      delete(seller.address1);
      delete(seller.address2);
      delete(seller.deliveryman);
    }

    return sellers;
  }

  async findAllSellerWithPagination(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')
      .where('user.role = :role', { role: 'SELLER' });
    
    if (query) {
      queryBuilder.andWhere('sellerProfile.name LIKE :query', { query: `%${query}%` });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.uid', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const user of users) {
      user.sellerId = user.sellerProfile.userId;
      user.name = user.sellerProfile.name;
      const { address1, address2 } = user.sellerProfile;
      user.address = address1 + " " + address2;
      user.mobile = user.sellerProfile.mobile;

      delete(user.uid);
      delete(user.id);
      delete(user.password);
      delete(user.role);
      delete(user.agreeAlarm);
      delete(user.sellerProfile);
    }

    return {
      list: users,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneSeller(sellerId: number) {
    const queryBuilder = this.sellerProfileRepository.createQueryBuilder('sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')
      .where('sellerProfile.userId = :sellerId', { sellerId });

    const seller = await queryBuilder.getOne();
    //const { address1, address2 } = seller;
    //seller.address = address1 + " " + address2;
    seller.deliverymanMobile = null;
    if (seller.deliveryman) {
      seller.deliverymanMobile = seller.deliveryman.mobile;
    }
    //delete(seller.address1);
    //delete(seller.address2);
    delete(seller.deliveryman);

    return seller;
  }

}