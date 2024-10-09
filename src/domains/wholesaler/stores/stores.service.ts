import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async findAllStore() {
    return await this.storeRepository.find();
  }
}
