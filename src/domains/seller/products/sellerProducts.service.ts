import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerRegisterProduct } from './entities/seller-register-product.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { CreateSellerRegisterProductDto } from './dto/create-seller-register-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { PaginatedSellerProducts } from './interfaces/paginated-seller-products.interface';
import { PaginatedSellerRegisterProducts } from './interfaces/paginated-seller-register-products.interface';

@Injectable()
export class SellerProductsService {
  constructor(
    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerRegisterProduct)
    private sellerRegisterProductRepository: Repository<SellerRegisterProduct>,
  ) {}

  async createSellerRegisterProduct(sellerId: number, createSellerRegisterProductDto: CreateSellerRegisterProductDto): Promise<SellerRegisterProduct> {
    const registerProduct = this.sellerRegisterProductRepository.create({
      sellerId,
      ...createSellerRegisterProductDto
    });
    return this.sellerRegisterProductRepository.save(registerProduct);
  }

  async createSellerProduct(sellerId: number, createSellerProductDto: CreateSellerProductDto): Promise<SellerProduct> {
    const product = this.sellerProductRepository.create({
      sellerId,
      ...createSellerProductDto
    });
    return this.sellerProductRepository.save(product);
  }

  async findOneSellerRegisterProductById(id: number): Promise<SellerRegisterProduct | undefined> {
    return this.sellerRegisterProductRepository.findOne({ where: { id } });
  }

  async findOneSellerRegisterProductBySellerIdAndProductCode(sellerId: number, productCode: string): Promise<SellerRegisterProduct | undefined> {
    return this.sellerRegisterProductRepository.findOne({ where: { sellerId, productCode } });
  }

  async findOneSellerProductBySellerIdAndWholesalerProductId(sellerId: number, wholesalerProductId: number): Promise<SellerProduct | undefined> {
    return this.sellerProductRepository.findOne({ where: { sellerId, wholesalerProductId } });
  }

  async findSellerRegisterProductsBySellerId(sellerId: number, paginationQuery: PaginationQueryDto): Promise<PaginatedSellerRegisterProducts> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [registerProducts, total] = await this.sellerRegisterProductRepository.findAndCount({
      where: { sellerId },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: registerProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findSellerProductsBySellerId(sellerId: number, paginationQuery: PaginationQueryDto): Promise<PaginatedSellerProducts> {
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

}
