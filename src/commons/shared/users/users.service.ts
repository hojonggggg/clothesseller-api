import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

}