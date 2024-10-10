import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mall } from './entities/mall.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class MallsService {
  constructor(
    @InjectRepository(Mall)
    private mallRepository: Repository<Mall>,
  ) {}

  async findAllMall(paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    const [malls, total] = await this.mallRepository.findAndCount({
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      list: malls,
      total,
      page: Number(page),
      totalPage: Math.ceil(total / limit),
    };
  }
}
