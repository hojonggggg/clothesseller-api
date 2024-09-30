import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { PaginatedUsers } from './interfaces/paginated-users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAllUsers(role: string, paginationQuery: PaginationQueryDto): Promise<PaginatedUsers> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
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
    return this.usersRepository.findOne({ where: { id } });
  }


}
