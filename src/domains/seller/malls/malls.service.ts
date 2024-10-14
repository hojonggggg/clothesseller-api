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

  async findAllMall() {

    const malls = await this.mallRepository.find({
      order: { id: 'DESC' }
    });
    return malls;
  }
}
