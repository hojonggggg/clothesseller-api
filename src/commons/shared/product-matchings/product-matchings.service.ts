import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { SellerProduct } from '../products/entities/seller-product.entity';
import { SellerProductOption } from '../products/entities/seller-product-option.entity';
import { ProductMatchingDto } from './dto/product-matching.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format';

@Injectable()
export class ProductMatchingsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productsService: ProductsService,

    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerProductOption)
    private sellerProductOptionRepository: Repository<SellerProductOption>,
  ) {}


  async findAllSellerProductOptionForSeller(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('sellerProductOption')
    .leftJoinAndSelect('sellerProductOption.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .where('sellerProduct.sellerId = :sellerId', { sellerId })
      .andWhere("sellerProductOption.isMatching = false");
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sellerProduct.name LIKE :sellerProductName', { sellerProductName: `%${query}%` });
        })
      );
    }

    const [options, total] = await queryBuilder
      .orderBy('sellerProductOption.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const option of options) {
      const { sellerProduct } = option;
      option.sellerProductOptionId = option.id;
      option.name = sellerProduct.name;
      option.price = formatCurrency(sellerProduct.price);
      option.mallName = sellerProduct.mall.name;
      delete(option.id);
      delete(option.sellerId);
      delete(option.sellerProduct);
      delete(option.wholesalerProductOptionId);
      delete(option.wholesalerOptionPrice);
      delete(option.quantity);
      delete(option.status);
      delete(option.isShow);
      delete(option.isReturned);
      delete(option.isDeleted);
    }
    
    return {
      list: options,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async _findOneSellerProductById(id: number) {
    return await this.sellerProductRepository.findOne({ where: { id } });
  }

  async _findOneSellerProductOptionById(id: number) {
    return await this.sellerProductOptionRepository.findOne({ where: { id } });
  }

  async productMatching(sellerProductOptionId: number, productMatchingDto: ProductMatchingDto) {
    const { sellerProductId, wholesalerId, wholesalerProductId, wholesalerProductOptionId } = productMatchingDto;
    const sellerProduct = await this._findOneSellerProductById(sellerProductId);
    if (sellerProduct.wholesalerProductId && sellerProduct.wholesalerProductId != wholesalerProductId) {
      throw new ConflictException('이미 매칭된 도매처 상품 ID와 다릅니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.sellerProductRepository.update(
        {
          id: sellerProductId
        },
        {
          wholesalerId,
          wholesalerProductId,
          isMatching: true
        }
      );

      await this.sellerProductOptionRepository.update(
        {
          id: sellerProductOptionId
        }, 
        {
          wholesalerProductOptionId,
          isMatching: true
        }
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}