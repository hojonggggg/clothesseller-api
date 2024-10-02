import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SellerProduct } from './entities/seller-product.entity';
//import { RegisterProduct } from './entities/register-product.entity';
//import { CreateRegisterProductDto } from './dto/create-register-product.dto';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
//import { PaginatedRegisterProducts } from './interfaces/paginated-register-products.interface';
import { PaginatedSellerProducts } from './interfaces/paginated-seller-products.interface';

@Injectable()
export class SellerProductsService {
  constructor(
    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
  ) {}

  async createSellerProduct(sellerId: number, createProductDto: CreateProductDto): Promise<SellerProduct> {
    const product = this.sellerProductRepository.create({
      sellerId,
      ...createProductDto
    });
    return this.sellerProductRepository.save(product);
  }

  async findOneSellerProductBySellerIdAndWholesalerProductId(sellerId: number, wholesalerProductId: number): Promise<SellerProduct | undefined> {
    return this.sellerProductRepository.findOne({ where: { sellerId, wholesalerProductId } });
  }

  async findAllSellerProductBySellerId(sellerId: number, paginationQuery: PaginationQueryDto): Promise<PaginatedSellerProducts> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [products, total] = await this.sellerProductRepository.findAndCount({
      where: { sellerId },
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

  async searchSellerProductBySellerId(sellerId: number, productName: string, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [products, total] = await this.sellerProductRepository.findAndCount({
      where: { sellerId, productName: Like(`%${productName}%`) },
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
