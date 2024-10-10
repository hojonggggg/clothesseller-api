import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class SellerProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerProductOption)
    private sellerProductOptionRepository: Repository<SellerProductOption>,
  ) {}

  async createSellerProduct(sellerId: number, createSellerProductDto: CreateSellerProductDto): Promise<SellerProduct> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const sellerProduct = await this.sellerProductRepository.save({
        sellerId,
        ...createSellerProductDto
      });

      const sellerProductId = Number(sellerProduct.id);
      const { options } = createSellerProductDto;
      for (const option of options) {
        const productOption = this.sellerProductOptionRepository.create(option);
        await this.sellerProductOptionRepository.save({
          sellerId, 
          sellerProductId, 
          ...productOption
        });
      }

      await queryRunner.commitTransaction();
      return sellerProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneSellerProductBySellerIdAndMallIdAndWholesalerProductId(sellerId: number, mallId: number, wholesalerProductId: number): Promise<SellerProduct | undefined> {
    return this.sellerProductRepository.findOne({ where: { sellerId, mallId, wholesalerProductId } });
  }

  async findAllSellerProductBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    /*
    const [products, total] = await this.sellerProductOptionRepository.findAndCount({
      where: { sellerId },
      relations: ['sellerProduct'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */

    const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('sellerProductOption')
      .leftJoinAndSelect('sellerProductOption.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .where('sellerProduct.sellerId = :sellerId', { sellerId });
    
    if (query) {
      queryBuilder.andWhere('sellerProduct.name LIKE :query', { query: `%${query}%` });
    }

    const [products, total] = await queryBuilder
      .orderBy('sellerProduct.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const product of products) {
      product.name = product.sellerProduct.name;
      product.sellerPrice = formatCurrency(product.sellerProduct.price);
      product.wholesalerPrice = formatCurrency(product.sellerProduct.wholesalerProductPrice);
      product.mallName = product.sellerProduct.mall.name;

      delete(product.sellerId);
      delete(product.sellerProductId);
      delete(product.sellerProduct);
    }

    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllStoresOfProductBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.sellerProductRepository.createQueryBuilder('sellerProduct')
      .select(['sellerProduct.id', 'sellerProduct.wholesalerId', 'COUNT(sellerProduct.id) AS productCount'])
      .leftJoinAndSelect('sellerProduct.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .where('sellerProduct.sellerId = :sellerId', { sellerId })
      .groupBy('store.id')
      .addGroupBy('store.name');
      
    
    if (query) {
      queryBuilder.andWhere('store.name LIKE :query', { query: `%${query}%` });
    }
    
    const [stores, total] = await queryBuilder
      .orderBy('sellerProduct.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const store of stores) {
      store.storeId = store.wholesalerProfile.store.id;
      store.storeName = store.wholesalerProfile.store.name;

      delete(store.id);
      delete(store.wholesalerId);
      delete(store.wholesalerProfile);
    }
    
    return {
      list: stores,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
