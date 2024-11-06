import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDtoFromAdmin } from './dto/admin-create-wholesaler-product.dto';
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

  async findOneWholesalerProductByName(wholesalerId: number, name: string): Promise<WholesalerProduct | undefined> {
    return await this.wholesalerProductRepository.findOne({ where: {wholesalerId, name} });
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
}
