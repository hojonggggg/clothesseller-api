import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerProductOption } from './entities/seller-product-option.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

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
      /*
       * 옵션 추가
       */

      await queryRunner.commitTransaction();
      return sellerProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneSellerProductBySellerIdAndWholesalerProductId(sellerId: number, wholesalerProductId: number): Promise<SellerProduct | undefined> {
    return this.sellerProductRepository.findOne({ where: { sellerId, wholesalerProductId } });
  }

  async findAllSellerProductBySellerId(sellerId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    const [products, total] = await this.sellerProductOptionRepository.findAndCount({
      where: { sellerId },
      relations: ['sellerProduct'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    
    /*
    const query = this.wholesalerProductOptionRepository
      .createQueryBuilder('option')
      .leftJoinAndSelect('option.wholesalerProduct', 'product')
      .where('option.wholesalerId = :wholesalerId', { wholesalerId })
      .select([
        'option.id',
        'option.wholesalerId',
        'option.color',
        'option.size',
        'option.quantity',
        'product.name',
      ])
      .orderBy('option.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    const [products, total] = await query.getManyAndCount();
    */
    for (const product of products) {
      product.name = product.sellerProduct.name;
      delete(product.sellerProduct);
    }

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
