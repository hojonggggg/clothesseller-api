import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDto } from './dto/create-wholesaler-product.dto';
import { UpdateWholesalerProductDto } from './dto/update-wholesaler-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class WholesalerProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
  ) {}

  async createWholesalerProduct(wholesalerId: number, createWholesalerProductDto: CreateWholesalerProductDto): Promise<WholesalerProduct> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const wholesalerProduct = await this.wholesalerProductRepository.save({
        wholesalerId,
        ...createWholesalerProductDto
      });

      const wholesalerProductId = Number(wholesalerProduct.id);
      const { options } = createWholesalerProductDto;
      for (const option of options) {
        const productOption = this.wholesalerProductOptionRepository.create(option);
        await this.wholesalerProductOptionRepository.save({
          wholesalerId, 
          wholesalerProductId, 
          ...productOption
        });
      }

      await queryRunner.commitTransaction();
      return wholesalerProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneWholesalerProductByCode(wholesalerId: number, code: string): Promise<WholesalerProduct | undefined> {
    return await this.wholesalerProductRepository.findOne({ where: {wholesalerId, code} });
  }

  async findOneWholesalerProduct(wholesalerProductId: number) {
    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.options', 'options')
      .where('wholesalerProduct.id = :wholesalerProductId', { wholesalerProductId })
      .andWhere('options.isDeleted = false');

    const wholesalerProduct = await queryBuilder.getOne();
    wholesalerProduct.price = formatCurrency(wholesalerProduct.price);
    delete(wholesalerProduct.wholesalerId);

    //const wholesalerProductOptions = wholesalerProduct.options;
    const { options } = wholesalerProduct;
    for (const option of options) {
      option.optionId = option.id;
      option.price = formatCurrency(option.price);
      delete(option.id);
      delete(option.wholesalerId);
      delete(option.wholesalerProductId);
    }
    return wholesalerProduct;
  }

  async updateWholesalerProduct(wholesalerId: number, wholesalerProductId: number, updateWholesalerProductDto: UpdateWholesalerProductDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { code, name, price, country, composition, options } = updateWholesalerProductDto;

      await this.wholesalerProductRepository.update(
        {
          id: wholesalerProductId,
          wholesalerId
        }, {
          code,
          name,
          price,
          country,
          composition
        }
      );

      for (const option of options) {
        const { optionId, color, size, price, quantity } = option;
        let isSoldout = true;
        if (quantity > 0) isSoldout = false;

        if (optionId) {
          await this.wholesalerProductOptionRepository.update(
            {
              id: optionId,
              wholesalerId
            }, {
              color,
              size,
              price,
              quantity,
              isSoldout
            }
          );
        } else {
          const productOption = this.wholesalerProductOptionRepository.create(option);
          await this.wholesalerProductOptionRepository.save({
            wholesalerId, 
            wholesalerProductId, 
            ...productOption,
            isSoldout
          });
        }
        
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllWholesalerProductWithPagination(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    
    const [products, total] = await this.wholesalerProductRepository.findAndCount({
      where: { wholesalerId },
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    
    for (const product of products) {
      product.price = formatCurrency(product.price);
      delete(product.wholesalerId);
    }
    
    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllWholesalerProductOption(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    
    const [options, total] = await this.wholesalerProductOptionRepository.findAndCount({
      where: { 
        wholesalerId, 
        isDeleted: false
      },
      relations: ['wholesalerProduct'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });
    
    for (const option of options) {
      option.optionPrice = formatCurrency(option.price);
      option.wholesalerProduct.price = formatCurrency(option.wholesalerProduct.price);
      delete(option.wholesalerId);
      delete(option.price);
      delete(option.isDeleted);
      delete(option.wholesalerProduct.id);
      delete(option.wholesalerProduct.wholesalerId);
    }
    
    return {
      list: options,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async deleteWholesalerProducts(wholesalerId: number, ids: number[]): Promise<void> {
    await this.wholesalerProductOptionRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isDeleted: true
      }
    );
  }
  //////////////////////
  async findAllWholesalerProduct(wholesalerId: number, query: string) {
    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .where('wholesalerProduct.wholesalerId = :wholesalerId', { wholesalerId })
      .select([
        'wholesalerProduct.id',
        'wholesalerProduct.code',
        'wholesalerProduct.name',
        'wholesalerProduct.price',
      ]);
    
    if (query) {
      queryBuilder.andWhere('wholesalerProduct.name LIKE :query', { query: `%${query}%` });
    }

    const products = await queryBuilder
      .orderBy('wholesalerProduct.id', 'DESC')
      .getMany();
    
    for (const product of products) {
      product.price = formatCurrency(product.price);
    }
    
    return products;
  }

  async findAllWholesalerProductOptionWithPagination(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    
    const [products, total] = await this.wholesalerProductOptionRepository.findAndCount({
      where: { wholesalerId },
      relations: ['wholesalerProduct'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
    });

    for (const product of products) {
      product.code = product.wholesalerProduct.code;
      product.name = product.wholesalerProduct.name;
      product.wholesalerProductOptionId = product.id;
      delete(product.wholesalerId);
      delete(product.wholesalerProduct);
    }
    
    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneWholesalerProductByWholesalerProductId(sellerId: number, wholesalerProductId: number) {
    
    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.wholesalerProductOptions', 'wholesalerProductOptions')
      .where('wholesalerProduct.id = :wholesalerProductId', { wholesalerProductId });

    const wholesalerProduct = await queryBuilder.getOne();
    const wholesalerProductOptions = wholesalerProduct.options;
    for (const wholesalerProductOption of wholesalerProductOptions) {
      //delete(sellerProductOption.sellerId);
      //delete(sellerProductOption.sellerProductId);
    }
    return wholesalerProduct;
  }
}
