import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDtoFromAdmin } from './dto/create-wholesaler-product.dto';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format-currency';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerProductOption)
    private sellerProductOptionRepository: Repository<SellerProductOption>,
  ) {}

  async _generateProductCode() {
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

    return code;
  }

  async createWholesalerProduct(createWholesalerProductDto: CreateWholesalerProductDtoFromAdmin) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const code = await this._generateProductCode();
      const wholesalerProduct = await this.wholesalerProductRepository.save({
        code,
        ...createWholesalerProductDto
      });
      
      const wholesalerProductId = Number(wholesalerProduct.id);
      const { wholesalerId, options } = createWholesalerProductDto;
      for (const option of options) {
        const productOption = this.wholesalerProductOptionRepository.create(option);
        await this.wholesalerProductOptionRepository.save({
          wholesalerId, 
          wholesalerProductId, 
          ...productOption
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

  async findOneWholesalerProductByWholesalerIdAndName(wholesalerId: number, name: string): Promise<WholesalerProduct | undefined> {
    return await this.wholesalerProductRepository.findOne({ where: {wholesalerId, name} });
  }

  async findOneWholesalerProductById(id: number) {
    const queryBuilder = this.wholesalerProductRepository.createQueryBuilder('wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.options', 'options')
      .where('wholesalerProduct.id = :id', { id });

    const wholesalerProduct = await queryBuilder.getOne();
    wholesalerProduct.price = formatCurrency(wholesalerProduct.price);
    const { options } = wholesalerProduct;
    for (const option of options) {
      option.optionId = option.id;
      option.price = formatCurrency(option.price);
      delete(option.wholesalerId);
      delete(option.wholesalerProductId);
      delete(option.isDeleted);
    }

    return wholesalerProduct;
  }

  async findAllWholesalerProductForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

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

  async findOneSellerProductById(id: number) {
    const queryBuilder = this.sellerProductRepository.createQueryBuilder('sellerProduct')
      .leftJoinAndSelect('sellerProduct.sellerProductOptions', 'sellerProductOptions')
      .leftJoinAndSelect('sellerProduct.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .leftJoinAndSelect('sellerProduct.wholesalerProduct', 'wholesalerProduct')
      .where('sellerProduct.id = :id', { id });
    
    const sellerProduct = await queryBuilder.getOne();
    const sellerProductOptions = sellerProduct.sellerProductOptions;
    for (const sellerProductOption of sellerProductOptions) {
      sellerProductOption.optionId = sellerProductOption.id;
      sellerProductOption.price = formatCurrency(sellerProductOption.price);
      sellerProductOption.wholesalerOptionPrice = formatCurrency(sellerProductOption.wholesalerOptionPrice);
      delete(sellerProductOption.sellerId);
      delete(sellerProductOption.sellerProductId);
      delete(sellerProductOption.isShow);
      delete(sellerProductOption.isDeleted);
      delete(sellerProductOption.isReturned);
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

  async findAllSellerProductForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerProductRepository.createQueryBuilder('sellerProduct')
      .leftJoinAndSelect('sellerProduct.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerProduct.mall', 'mall');
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sellerProduct.name LIKE :sellerProductName', { sellerProductName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` });
        })
      );
    }

    const [products, total] = await queryBuilder
      .orderBy('sellerProduct.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    for (const product of products) {
      product.price = formatCurrency(product.price);
      product.wholesalerProductPrice = formatCurrency(product.wholesalerProductPrice);
      product.sellerName = product.sellerProfile.name;
      product.mallName = product.mall.name;
      delete(product.wholesalerId);
      delete(product.sellerId);
      delete(product.sellerProfile);
      delete(product.mallId);
      delete(product.mall);
    }
    
    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}