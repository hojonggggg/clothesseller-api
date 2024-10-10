import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRequest } from './entities/product-request.entity';
import { _CreateProductRequestDto } from './dto/create-product-request.dto';
//import { WholesalerProductsService } from '../wholesaler/products/wholesalerProducts.service';
import { WholesalerProductsService } from '../products/wholesaler/wholesaler.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class ProductRequestsService {
  constructor(
    private readonly dataSource: DataSource,
    private wholesalerProductsService: WholesalerProductsService,

    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
  ) {}

  async createProductRequest(sellerId: number, createProductRequestDto: _CreateProductRequestDto): Promise<ProductRequest> {
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
    const { pageNumber, pageSize } = paginationQuery;
    const skip = (pageNumber - 1) * pageSize;

    const [ProductRequests, total] = await this.productRequestRepository.findAndCount({
      where: { wholesalerId },
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

  async findAllProductRequestBySellerId(sellerId: number, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const [productRequests, total] = await this.productRequestRepository.findAndCount({
      where: { sellerId },
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    return {
      list: productRequests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async updateProductRequestStatus(wholesalerId: number, productRequestId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.productRequestRepository.update(
        {
          id: productRequestId,
          wholesalerId
        },
        {
          status: 'CONFIRM'
        }
      );

      const productRequest = await this.findOneProductRequestById(productRequestId);

      const createWholesalerProductDto = {
        productCode: productRequest.productCode, 
        productName: productRequest.wholesalerProductName,
        productPrice: productRequest.wholesalerProductPrice,
        storeId: null, 
        wholesalerId: null, 
        wholesalerProductId: null, 
        wholesalerProductPrice: null
      };

      await this.wholesalerProductsService.createWholesalerProduct(wholesalerId, createWholesalerProductDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
