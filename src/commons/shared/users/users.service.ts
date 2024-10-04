import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WholesalerProfile } from './entities/wholesaler-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WholesalerProfile)
    private wholesalerProfileRepository: Repository<WholesalerProfile>,
  ) {}

  async createUser(createUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userRepository.save(createUserDto);
      delete(user.password);
      const userId = Number(await user.uid);
      const { role } = createUserDto;
      if (role === 'ADMIN') {

      } else if (role === 'WHOLESALER') {
        await this.createWholesalerProfile(userId, createUserDto);
      } else if (role === 'SELLER') {

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

  async findOneUserById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

}