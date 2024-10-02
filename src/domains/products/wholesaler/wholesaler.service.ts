import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerProductsService {
  constructor(
    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
  ) {}

  async searchWholesalerProductByWholesalerId(wholesalerId: number, productName: string, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [products, total] = await this.wholesalerProductRepository.findAndCount({
      where: { wholesalerId, productName: Like(`%${productName}%`) },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

}
