import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { WholesalerProduct } from '../products/entities/wholesaler-product.entity';
import { SellerProduct } from '../products/entities/seller-product.entity';
import { SellerProductOption } from '../products/entities/seller-product-option.entity';
import { SellerProductPlus } from '../products/entities/seller-product-plus.entity';
import { SellerOrder } from '../orders/entities/seller-order.entity';
import { ProductMatchingDto } from './dto/product-matching.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format';

@Injectable()
export class ProductMatchingsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productsService: ProductsService,

    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerProductOption)
    private sellerProductOptionRepository: Repository<SellerProductOption>,
    @InjectRepository(SellerProductPlus)
    private sellerProductPlusRepository: Repository<SellerProductPlus>,
    @InjectRepository(SellerOrder)
    private sellerOrderRepository: Repository<SellerOrder>,
  ) {}


  async findAllSellerProductOptionForSeller(sellerId: number, mallId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('sellerProductOption')
    .leftJoinAndSelect('sellerProductOption.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .where('sellerProduct.sellerId = :sellerId', { sellerId })
      .where('sellerProduct.mallId = :mallId', { mallId })
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
      delete(option.isMatching);
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

  async _findOneWholesalerProductById(id: number) {
    return await this.wholesalerProductRepository.findOne({ where: { id } });
  }

  async _findOneSellerProductById(id: number) {
    return await this.sellerProductRepository.findOne({ where: { id } });
  }

  async _findOneSellerProductOptionById(id: number) {
    return await this.sellerProductOptionRepository.findOne({ where: { id } });
  }

  async productMatching(sellerId: number, sellerProductOptionId: number, productMatchingDto: ProductMatchingDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { mallId, sellerProductId, wholesalerId, wholesalerProductId, wholesalerProductOptionId, wholesalerProductPrice, options } = productMatchingDto;

      await this.sellerProductRepository.update(
        {
          id: sellerProductId
        },
        {
          wholesalerId,
          wholesalerProductId,
          wholesalerProductPrice,
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

      await this.sellerOrderRepository.update(
        {
          sellerProductOptionId
        }, 
        {
          wholesalerId,
          wholesalerProductId,
          wholesalerProductOptionId,
          isMatching: true
        }
      );

      for (const option of options) {
        await this.sellerProductPlusRepository.save(
          {
            mallId,
            sellerId,
            ...option
          }
        )
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