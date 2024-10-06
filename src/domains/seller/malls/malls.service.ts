import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mall } from './entities/mall.entity';

@Injectable()
export class MallsService {
  constructor(
    @InjectRepository(Mall)
    private mallRepository: Repository<Mall>,
  ) {}

  async findAllMall() {
    return await this.mallRepository.find();
  }
}
