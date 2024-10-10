import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerProductsService {
  constructor(
    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
  ) {}

  async createWholesalerProduct(wholesalerId: number, createProductDto: CreateProductDto): Promise<WholesalerProduct> {
    delete(createProductDto.wholesalerId);
    const product = this.wholesalerProductRepository.create({
      wholesalerId,
      ...createProductDto
    });
    return this.wholesalerProductRepository.save(product);
  }

  async searchWholesalerProductByWholesalerId(wholesalerId: number, productName: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    const skip = (pageNumber - 1) * pageSize;

    const [products, total] = await this.wholesalerProductRepository.findAndCount({
      where: { wholesalerId, productName: Like(`%${productName}%`) },
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

}
