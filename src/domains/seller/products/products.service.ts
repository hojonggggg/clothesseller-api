import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';
import { Return } from 'src/commons/shared/entities/return.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { UpdateSellerProductDto } from './dto/update-seller-product.dto';
import { ReturnSellerProductDto } from './dto/return-seller-product.dto';
import { DeleteSellerProductDto } from './dto/delete-seller-product.dto';
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
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async summarySellerProduct(sellerId: number, mallId: number) {
    const result = {
      totalProduct: 100,
      soldoutProduct: 10,
      needOrderProduct: 5,
      totalProductQuantity: 500
    };
    return result;
  }

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
      .where('sellerProduct.sellerId = :sellerId', { sellerId })
      .andWhere('sellerProductOption.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('sellerProductOption.isReturned = :isReturned', { isReturned: false });
    
    if (query) {
      queryBuilder.andWhere('sellerProduct.name LIKE :query', { query: `%${query}%` });
    }

    const [products, total] = await queryBuilder
      .orderBy('sellerProductOption.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const product of products) {
      product.name = product.sellerProduct.name;
      product.sellerPrice = formatCurrency(product.sellerProduct.price);
      product.wholesalerPrice = formatCurrency(product.sellerProduct.wholesalerProductPrice);
      product.mallName = product.sellerProduct.mall.name;

      delete(product.sellerId);
      //delete(product.sellerProductId);
      delete(product.sellerProduct);
      delete(product.wholesalerProductOptionId);
    }

    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneSellerProductBySellerProductId(sellerId: number, sellerProductId: number) {
    
    const queryBuilder = this.sellerProductRepository.createQueryBuilder('sellerProduct')
      .leftJoinAndSelect('sellerProduct.sellerProductOptions', 'sellerProductOptions')
      .leftJoinAndSelect('sellerProduct.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .leftJoinAndSelect('sellerProduct.wholesalerProduct', 'wholesalerProduct')
      .where('sellerProduct.id = :sellerProductId', { sellerProductId });
    
    const sellerProduct = await queryBuilder.getOne();
    const sellerProductOptions = sellerProduct.sellerProductOptions;
    for (const sellerProductOption of sellerProductOptions) {
      delete(sellerProductOption.sellerId);
      delete(sellerProductOption.sellerProductId);
    }

    sellerProduct.wholesalerProductCode = sellerProduct.wholesalerProduct.code;
    sellerProduct.mallName = sellerProduct.mall.name;
    sellerProduct.wholesalerName = sellerProduct.wholesalerProfile.name;
    sellerProduct.wholesalerStoreName = sellerProduct.wholesalerProfile.store.name;
    sellerProduct.wholesalerStoreRoomNo = sellerProduct.wholesalerProfile.roomNo;
    sellerProduct.wholesalerMobile = sellerProduct.wholesalerProfile.mobile;
    sellerProduct.price = formatCurrency(sellerProduct.price);
    sellerProduct.wholesalerProductPrice = formatCurrency(sellerProduct.wholesalerProductPrice);

    delete(sellerProduct.sellerId);
    delete(sellerProduct.mallId);
    delete(sellerProduct.wholesalerId);
    delete(sellerProduct.wholesalerProductId);
    delete(sellerProduct.wholesalerProfile);
    delete(sellerProduct.mall);
    delete(sellerProduct.wholesalerProduct);

    return sellerProduct;
  }

  async updateSellerProduct(sellerId: number, sellerProductId: number, updateSellerProductDto: UpdateSellerProductDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.sellerProductRepository.update(
        {
          id: sellerProductId,
          sellerId
        }, {
          wholesalerProductPrice: updateSellerProductDto.wholesalerProductPrice,
          name: updateSellerProductDto.name,
          price: updateSellerProductDto.price
        }
      );

      const { options } = updateSellerProductDto;
      for (const option of options) {
        const sellerProductOptionId = option.id;

        await this.sellerProductOptionRepository.update(
          {
            id: sellerProductOptionId,
            sellerId
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
      store.id = store.wholesalerId;
      store.wholesalerName = store.wholesalerProfile.name;
      store.wholesalerStoreName = store.wholesalerProfile.store.name;

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

  async returnSellerProduct(sellerId: number, ids: number[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const sellerProductOptionId of ids) {
        //const sellerProductOptionId = returnSellerProductDto.id;
        
        await this.sellerProductOptionRepository.update(
          {
            id: sellerProductOptionId,
            sellerId
          }, {
            status: '반품',
            isShow: false,
            isReturned: true
          }
        );
        
        const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('sellerProductOption')
          .leftJoinAndSelect('sellerProductOption.sellerProduct', 'sellerProduct')
          .where('sellerProductOption.id = :sellerProductOptionId', { sellerProductOptionId });
        const sellerProductOption = await queryBuilder.getOne();
        const sellerProduct = sellerProductOption.sellerProduct;
        const { wholesalerId, wholesalerProductId, wholesalerProductPrice } = sellerProduct;
        const { sellerProductId, wholesalerProductOptionId, quantity } = sellerProductOption;
        
        const returnProduct = this.returnRepository.create({
          type: '재고상품',
          wholesalerId,
          wholesalerProductId,
          wholesalerProductOptionId,
          sellerId,
          sellerProductId,
          sellerProductOptionId,
          quantity,
          price: wholesalerProductPrice
        });

        await this.returnRepository.save(returnProduct);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSellerProduct(sellerId: number, ids: number[]): Promise<void> {
    /*
    for (const deleteSellerProductDto of deleteSellerProductDtos) {
      const sellerProductOptionId = deleteSellerProductDto.id;
      
      await this.sellerProductOptionRepository.update(
        {
          id: sellerProductOptionId,
          sellerId
        }, {
          status: '삭제',
          isShow: false,
          isDeleted: true
        }
      );
    }
    */
    await this.sellerProductOptionRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        status: '삭제',
        isShow: false,
        isDeleted: true
      }
    );
  }
}
