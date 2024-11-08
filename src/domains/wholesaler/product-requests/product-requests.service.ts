import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { ProductRequestOption } from 'src/commons/shared/entities/product-request-option.entity';
import { WholesalerProduct } from '../products/entities/wholesaler-product.entity';
import { WholesalerProductOption } from '../products/entities/wholesaler-product-option.entity';
import { ApproveProductRequestDto } from 'src/commons/shared/product-requests/dto/approve-product-request.dto';
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
      .leftJoinAndSelect('productRequest.sellerProfile', 'sellerProfile')
      .where('productRequest.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('productRequest.isDeleted = 0')
      .andWhere('options.isDeleted = 0');

      if (query) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('productRequest.name LIKE :productName', { productName: `%${query}%` })
              .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` });
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
        request.sellerName = request.sellerProfile.name;

        for (const option of options) {
          option.price = formatCurrency(option.price);
          delete(option.productRequestId);
          delete(option.isDeleted);
        }

        delete(request.wholesalerId);
        delete(request.sellerId);
        delete(request.sellerProfile);
        delete(request.isDeleted);
      }

      return {
        list: requests,
        total,
        page: Number(pageNumber),
        totalPage: Math.ceil(total / pageSize)
      }
  }

  async findOneProductRequest(productRequestId: number) {
    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .leftJoinAndSelect('productRequest.sellerProfile', 'sellerProfile')
      .where('productRequest.id = :productRequestId', { productRequestId })
      .andWhere('options.isDeleted = 0');

    const productRequest = await queryBuilder.getOne();

    const { options } = productRequest;
    for (const option of options) {
      option.price = formatCurrency(option.price);
      delete(option.productRequestId);
      delete(option.isDeleted);
    }

    productRequest.sellerName = productRequest.sellerProfile.name;
    const sellerAddress1 = productRequest.sellerProfile.address1;
    const sellerAddress2 = productRequest.sellerProfile.address2;
    productRequest.sellerAddress = sellerAddress1 + " " + sellerAddress2;
    productRequest.sellerMobile = productRequest.sellerProfile.mobile;
    
    productRequest.price = formatCurrency(productRequest.price);
    delete(productRequest.wholesalerId);
    delete(productRequest.sellerId);
    delete(productRequest.sellerProfile);
    delete(productRequest.isDeleted);

    return productRequest;
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

      const { name, price, country, composition, options } = approveProductRequestDto;
      const lastProduct = await this.wholesalerProductRepository
        .createQueryBuilder('wholesalerProduct')
        .select('wholesalerProduct.code AS code')
        .orderBy('wholesalerProduct.id', 'DESC')
        .getRawOne();
      const lastProductCode = lastProduct.code;
      const lastProductCodeNumber = lastProductCode.replace('CS', '');
      const newProductCodeNumber = (lastProductCodeNumber * 1) + 1;
      const formattedCodeNumber = newProductCodeNumber.toString().padStart(6, '0');
      const code = 'CS' + formattedCodeNumber;
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
