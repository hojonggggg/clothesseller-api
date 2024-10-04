import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Deliveryman } from './entities/deliveryman.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { PaginatedUsers } from './interfaces/paginated-users.interface';
import * as bcrypt from 'bcrypt';

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
    @InjectRepository(Deliveryman)
    private deliverymanRepository: Repository<Deliveryman>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      const userId = Number(await user.uid);
      const role = createUserDto.role;
      delete(user.password);
      if (role === 'WHOLESALER') {
        await this.createWholesalerProfile(userId, createUserDto);
        delete(user.address1);
        delete(user.address2);
      } else if (role === 'SELLER') {
        await this.createSellerProfile(userId, createUserDto);
        delete(user.mallId);
        delete(user.roomNo);
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

  async findAllUsers(role: string, paginationQuery: PaginationQueryDto): Promise<PaginatedUsers> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: ['id'], 
      where: { role },
      order: { uid: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneUserById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createDeliveryman(sellerId: number, createDeliverymanDto: CreateDeliverymanDto): Promise<Deliveryman> {
    console.log({sellerId, createDeliverymanDto});
    return await this.deliverymanRepository.save({
      sellerId,
      ...createDeliverymanDto
    });
  }

  async findOneDeliverymanBySellerIdAndMobile(sellerId: number, mobile: string): Promise<Deliveryman | undefined> {
    return await this.deliverymanRepository.findOne({ where: {sellerId, mobile} });
  }


}
