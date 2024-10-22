import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, Brackets } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { DeleteProductRequestDto } from './dto/delete-product-request.dto';
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

  async findOneProductRequestByWholesalerIdAndCode(wholesalerId: number, code: string): Promise<ProductRequest | undefined> {
    return this.productRequestRepository.findOne({ where: { wholesalerId, code } });
  }

  async findAllProductRequestBySellerId(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .leftJoinAndSelect('productRequest.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('productRequest.sellerId = :sellerId', { sellerId })
      .andWhere('productRequest.isDeleted = 0')
      .andWhere('options.isDeleted = 0');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('productRequest.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }

    const [requests, total] = await queryBuilder
      .orderBy('productRequest.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const request of requests) {
      const { options } = request;
      request.price = formatCurrency(request.price);
      request.wholesalerName = request.wholesalerProfile.name;
      request.wholesalerStoreName = request.wholesalerProfile.store.name;
      request.wholesalerRoomNo = request.wholesalerProfile.roomNo;

      for (const option of options) {
        option.price = formatCurrency(option.price);
        delete(option.productRequestId);
        delete(option.isDeleted);
      }

      delete(request.wholesalerId);
      delete(request.wholesalerProfile);
      delete(request.sellerId);
      delete(request.isDeleted);
    }

    return {
      list: requests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneProductRequest(productRequestId: number) {
    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .where('productRequest.id = :productRequestId', { productRequestId })
      .andWhere('options.isDeleted = 0');

    const productRequest = await queryBuilder.getOne();

    const { options } = productRequest;
    for (const option of options) {
      option.price = formatCurrency(option.price);
      delete(option.productRequestId);
      delete(option.isDeleted);
    }

    productRequest.price = formatCurrency(productRequest.price);
    delete(productRequest.wholesalerId);
    delete(productRequest.sellerId);
    delete(productRequest.isDeleted);

    return productRequest;
  }

  async updateProductRequest(sellerId: number, productRequestId: number, updateProductRequestDto: UpdateProductRequestDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { wholesalerId, code, name, price, country, composition, options } = updateProductRequestDto;

      await this.productRequestRepository.update(
        {
          id: productRequestId,
          sellerId
        }, {
          wholesalerId,
          code,
          price,
          name,
          country,
          composition
        }
      );

      for (const option of options) {
        const productRequestOptionId = option.id;

        await this.productRequestOptionRepository.update(
          {
            id: productRequestOptionId,
          }, {
            ...option
          }
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProductRequests(sellerId: number, ids: number[]): Promise<void> {
    await this.productRequestRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        isDeleted: true
      }
    )
  }
}
