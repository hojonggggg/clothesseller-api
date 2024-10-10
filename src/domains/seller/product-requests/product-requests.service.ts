import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-requests.entity';
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
    return await this.productRequestRepository.save(registerProduct);
  }

  async findOneProductRequestById(id: number): Promise<ProductRequest | undefined> {
    return await this.productRequestRepository.findOne({ where: { id } });
  }

  async findOneProductRequestBySellerIdAndProductCode(sellerId: number, productCode: string): Promise<ProductRequest | undefined> {
    return this.productRequestRepository.findOne({ where: { sellerId, productCode } });
  }

  async findAllProductRequestBySellerId(sellerId: number, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    const [ProductRequests, total] = await this.productRequestRepository.findAndCount({
      where: { sellerId },
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    return {
      list: ProductRequests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
