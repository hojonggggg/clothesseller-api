import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRequest } from './entities/product-request.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class ProductRequestsService {
  constructor(
    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
  ) {}

  async createProductRequest(sellerId: number, createProductRequestDto: CreateProductRequestDto): Promise<ProductRequest> {
    const registerProduct = this.productRequestRepository.create({
      sellerId,
      ...createProductRequestDto
    });
    return this.productRequestRepository.save(registerProduct);
  }

  async findOneProductRequestById(id: number): Promise<ProductRequest | undefined> {
    return this.productRequestRepository.findOne({ where: { id } });
  }

  async findOneProductRequestBySellerIdAndProductCode(sellerId: number, productCode: string): Promise<ProductRequest | undefined> {
    return this.productRequestRepository.findOne({ where: { sellerId, productCode } });
  }

  async findAllProductRequestByWholesalerId(wholesalerId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [ProductRequests, total] = await this.productRequestRepository.findAndCount({
      where: { wholesalerId },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: ProductRequests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllProductRequestBySellerId(sellerId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [ProductRequests, total] = await this.productRequestRepository.findAndCount({
      where: { sellerId },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: ProductRequests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
