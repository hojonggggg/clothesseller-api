import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class ProductRequestsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
    @InjectRepository(ProductRequestOption)
    private productRequestOptionRepository: Repository<ProductRequestOption>,
  ) {}

  async createProductRequest(sellerId: number, createProductRequestDto: CreateProductRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const productRequest = await this.productRequestRepository.save({
        sellerId,
        ...createProductRequestDto
      });

      const productRequestId = Number(productRequest.id);
      const { options } = createProductRequestDto;
      for (const option of options) {
        const productOption = this.productRequestOptionRepository.create(option);
        await this.productRequestOptionRepository.save({
          productRequestId, 
          ...productOption
        });
      }
      //return await this.productRequestRepository.save(registerProduct);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneProductRequestById(id: number): Promise<ProductRequest | undefined> {
    return await this.productRequestRepository.findOne({ where: { id } });
  }

  async findOneProductRequestBySellerIdAndProductCode(sellerId: number, productCode: string): Promise<ProductRequest | undefined> {
    return this.productRequestRepository.findOne({ where: { sellerId, productCode } });
  }

  async findAllProductRequestBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.productRequestOptionRepository.createQueryBuilder('productRequestOption')
      .leftJoinAndSelect('productRequestOption.productRequest', 'productRequest')
      .where('productRequest.sellerId = :sellerId', { sellerId });
    
    if (query) {
      queryBuilder.andWhere('productRequest.sellerProductName LIKE :query', { query: `%${query}%` });
    }

    const [requests, total] = await queryBuilder
      .orderBy('productRequestOption.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const request of requests) {
      request.wholesalerProductName = request.productRequest.wholesalerProductName;
      request.wholesalerProductPrice =  formatCurrency(request.productRequest.wholesalerProductPrice);
      request.sellerProductName = request.productRequest.sellerProductName;
      request.sellerProductPrice = formatCurrency(request.productRequest.sellerProductPrice);
      request.status = request.productRequest.status;

      delete(request.productRequestId);
      delete(request.productRequest);
    }

    return {
      list: requests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneProductRequestByProductReguestId(sellerId: number, productReguestId: number) {
    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .where('productRequest.id = :productReguestId', { productReguestId });

    const productRequest = await queryBuilder.getOne();
    productRequest.sellerProductPrice = formatCurrency(productRequest.sellerProductPrice);
    productRequest.wholesalerProductPrice = formatCurrency(productRequest.wholesalerProductPrice);

    return productRequest;
  }
}
