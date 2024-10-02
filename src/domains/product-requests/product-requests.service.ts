import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRequest } from './entities/product-request.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
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
