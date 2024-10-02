import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { SellerProfile } from './entities/seller-profile.entity';
import { Deleveryman } from './entities/deleveryman.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDeleverymanDto } from './dto/create-deleveryman.dto';
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
    @InjectRepository(Deleveryman)
    private deleverymanRepository: Repository<Deleveryman>,
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
console.log({user});
      const userId = Number(await user.uid);
      const role = createUserDto.role;
      console.log({userId, createUserDto});
      const { licenseNumber, name, mobile, mallId, roomNo, address1, address2 } = createUserDto;
      if (role === 'WHOLESALER') {
        await this.createWholesalerProfile(userId, createUserDto);
        //await this.createWholesalerProfile(userId, licenseNumber, name, mallId, roomNo, mobile);
      } else if (role === 'SELLER') {
        await this.createSellerProfile(userId, createUserDto);
      }

      await queryRunner.commitTransaction();
      //return await this.userRepository.save(user);
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
  
 /*
  async createWholesalerProfile(userId: number, licenseNumber: string, name: string, mallId: number, roomNo: string, mobile: string) {
    const wholesalerProfile = this.wholesalerProfileRepository.create({
      userId,
      licenseNumber,
      name,
      mallId,
      roomNo,
      mobile
    });
    await this.wholesalerProfileRepository.save(wholesalerProfile);
  }
  */
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

  async createDeleveryman(sellerId: number, createDeleverymanDto: CreateDeleverymanDto): Promise<Deleveryman> {
    console.log({sellerId, createDeleverymanDto});
    return await this.deleverymanRepository.save({
      sellerId,
      ...createDeleverymanDto
    });
  }

  async findOneDeleverymanBySellerIdAndMobile(sellerId: number, mobile: string): Promise<Deleveryman | undefined> {
    return await this.deleverymanRepository.findOne({ where: {sellerId, mobile} });
  }


}
