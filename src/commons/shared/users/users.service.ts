import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Store } from 'src/domains/wholesaler/stores/entities/store.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

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
      .orderBy('user.id', 'DESC')
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
    wholesaler.storeName = wholesaler.store.name;
    delete(wholesaler.storeId);
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
      .orderBy('user.id', 'DESC')
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
    const { address1, address2 } = seller;
    seller.address = address1 + " " + address2;
    seller.deliverymanMobile = null;
    if (seller.deliveryman) {
      seller.deliverymanMobile = seller.deliveryman.mobile;
    }
    delete(seller.address1);
    delete(seller.address2);
    delete(seller.deliveryman);

    return seller;
  }

}