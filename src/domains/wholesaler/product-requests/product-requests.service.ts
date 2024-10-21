import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';
import { WholesalerProduct } from '../products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { ApproveProductRequestDto } from './dto/approve-product-request.dto';
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
    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
  ) {}

  async findAllProductRequestByWholesalerId(wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .where('productRequest.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('options.isDeleted = 0');

      if (query) {
        queryBuilder.andWhere('productRequest.name LIKE :query', { query: `%${query}%` });
      }

      const [requests, total] = await queryBuilder
        .orderBy('productRequest.id', 'DESC')
        .take(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .getManyAndCount();
      
      for (const request of requests) {
        const { options } = request;
        request.price = formatCurrency(request.price);

        for (const option of options) {
          option.price = formatCurrency(option.price);
          delete(option.productRequestId);
          delete(option.isDeleted);
        }
        
        delete(request.wholesalerId);
      }

      return {
        list: requests,
        total,
        page: Number(pageNumber),
        totalPage: Math.ceil(total / pageSize)
      }
  }

  async approveProductRequest(wholesalerId: number, productRequestId: number, approveProductRequestDto: ApproveProductRequestDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.productRequestRepository.update(
        {
          id: productRequestId,
          wholesalerId,
          status: '등록요청'
        }, {
          status: '등록완료'
        }
      );

      const { code, name, price, country, composition, options } = approveProductRequestDto;
      const product = await this.wholesalerProductRepository.save({
        wholesalerId,
        code,
        name,
        price,
        country,
        composition
      });

      const wholesalerProductId = product.id;
      for (const option of options) {
        const { color, size, price, quantity } = option;
        await this.wholesalerProductOptionRepository.save({
          wholesalerId,
          wholesalerProductId,
          color,
          size,
          price,
          quantity
        });
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
