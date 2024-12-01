import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets, In } from 'typeorm';
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

      const wholesalerProduct = await this.wholesalerProductRepository.save({
        wholesalerId,
        code,
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

  async findOneWholesalerProductByName(wholesalerId: number, name: string): Promise<WholesalerProduct | undefined> {
    return await this.wholesalerProductRepository.findOne({ where: {wholesalerId, name} });
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
        const { optionId, color, size, price, quantity, isDeleted } = option;
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
              isDeleted,
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
  /*
  async findAllWholesalerProductForAdmin(query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;

    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :wholesalerProductName', { wholesalerProductName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }

    const [products, total] = await queryBuilder
      .orderBy('wholesalerProduct.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const product of products) {
      product.price = formatCurrency(product.price);
      product.wholesalerName = product.wholesalerProfile.name;
      product.wholesalerStoreName = product.wholesalerProfile.store.name;
      product.wholesalerStoreRoomNo = product.wholesalerProfile.roomNo;
      delete(product.wholesalerId);
      delete(product.wholesalerProfile);
    }
    
    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
  */
  async findAllWholesalerProductOption(wholesalerId: number, query: string) {
    const options = await this.wholesalerProductOptionRepository.find({
      where: { 
        wholesalerId, 
        isDeleted: false
      },
      relations: ['wholesalerProduct'],
      order: { id: 'DESC' }
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
    
    return options;
  }

  async findAllWholesalerProductOptionWithPagination(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    /*
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
    */
    const queryBuilder = this.wholesalerProductOptionRepository.createQueryBuilder('wpo')
      .leftJoinAndSelect('wpo.wholesalerProduct', 'wp')
      .where('wpo.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('wpo.isDeleted = :isDeleted', { isDeleted: false });

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wp.name LIKE :productName', { productName: `%${query}%` });
        })
      );
    }

    const [options, total] = await queryBuilder
      .orderBy('wpo.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const option of options) {
      const price = option.price + option.wholesalerProduct.price;
      option.optionPrice = formatCurrency(option.price);
      //option.wholesalerProduct.price = formatCurrency(option.wholesalerProduct.price);
      option.wholesalerProduct.price = formatCurrency(price);
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

  async _findAllWholesalerProductOptionWithPagination(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
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
  /*
  async findOneWholesalerProductByWholesalerProductId(wholesalerProductId: number) {
    
    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.options', 'options')
      .where('wholesalerProduct.id = :wholesalerProductId', { wholesalerProductId });

    const wholesalerProduct = await queryBuilder.getOne();
    wholesalerProduct.price = formatCurrency(wholesalerProduct.price);
    const options = wholesalerProduct.options;
    for (const option of options) {
      option.optionId = option.id;
      option.price = formatCurrency(option.price);
      delete(option.wholesalerId);
      delete(option.wholesalerProductId);
      delete(option.isDeleted);
      //delete(sellerProductOption.sellerId);
      //delete(sellerProductOption.sellerProductId);
    }
    return wholesalerProduct;
  }
  */
}
