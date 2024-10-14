import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDto } from './dto/create-wholesaler-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

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
        //wholesalerProduct.options.push(productOption);
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

  async findOneWholesalerProductByWholesalerIdAndCode(wholesalerId: number, code: string): Promise<WholesalerProduct | undefined> {
    return await this.wholesalerProductRepository.findOne({ where: {wholesalerId, code} });
  }

  async findAllWholesalerProductByWholesalerId(wholesalerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    
    const [products, total] = await this.wholesalerProductOptionRepository.findAndCount({
      where: { wholesalerId },
      relations: ['wholesalerProduct'],
      order: { id: 'DESC' },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
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
      product.name = product.wholesalerProduct.name;
      delete(product.wholesalerProduct);
    }
    
    return {
      list: products,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
