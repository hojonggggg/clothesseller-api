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

      const sellerOrders = await this.sellerOrderRepository.find({ where: { sellerId, orderType: "AUTO", isMatching: true }, order: { id: "DESC" } });
      const priorityIds = Array.from(new Set(sellerOrders.map(order => order.sellerProductOptionId)));
      console.log({priorityIds});

      const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('spo')
        .select([
          'spo.sellerProductId AS sellerProductId',
          'spo.id AS sellerProductOptionId',
          'sp.name AS name',
          'spo.color AS color',
          'spo.size AS size',
          'sp.price AS price',
          'mall.id AS mallId',
          'mall.name AS mallName',
          `IF(spo.id IN (3744, 207, 208, 203, 204), 0, 1) AS priority`
          //`CASE WHEN spo.id IN (:...priorityIds) THEN 0 ELSE 1 END AS priority`,
        ])
        .leftJoin('spo.sellerProduct', 'sp')
        .leftJoin('sp.mall', 'mall')
        .where('spo.sellerId = :sellerId', { sellerId })
        .andWhere('sp.mallId = :mallId', { mallId })
        .andWhere('spo.isMatching= :isMatching', { isMatching: false })
        //.andWhere('CASE WHEN spo.id IN (:...priorityIds) THEN 0 ELSE 1 END = 0', { priorityIds })  // priority가 0인 데이터만 필터링
        //.setParameters({ priorityIds: priorityIds.length > 0 ? priorityIds : [-1] });

      if (query) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('sp.name LIKE :sellerProductName', { sellerProductName: `%${query}%` });
          })
        );
      }

      queryBuilder
        .setParameters({ priorityIds })
        .orderBy('priority', 'ASC')
        .addOrderBy('spo.id', 'DESC');
      
      const allOptions = await queryBuilder.getRawMany();

      const total = await allOptions.length;
      const options = allOptions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
      
    /*
    const [ options, total ] = await queryBuilder
      .setParameters({ priorityIds })
      .orderBy('priority', 'ASC')
      .addOrderBy('spo.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      */
      return {
        list: options,
        total,
        page: Number(pageNumber),
        totalPage: Math.ceil(total / pageSize),
      };
  }

  async _findAllSellerProductOptionForSeller(sellerId: number, mallId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sellerProductOptionRepository.createQueryBuilder('sellerProductOption')
      .leftJoinAndSelect('sellerProductOption.sellerProduct', 'sellerProduct')
      .leftJoinAndSelect('sellerProduct.mall', 'mall')
      .where('sellerProduct.sellerId = :sellerId', { sellerId })
      .andWhere('sellerProduct.mallId = :mallId', { mallId })
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

    const allOptions = await queryBuilder
      .orderBy('sellerProductOption.id', 'DESC')
      .getRawMany();

    const sellerOrders = await this.sellerOrderRepository.find({ where: { sellerId, orderType: "AUTO", isMatching: true }, order: { id: "DESC" } });
//console.log({sellerOrders});
    const priorityIds = sellerOrders.map(order => order.sellerProductOptionId);
    console.log("Priority IDs:", priorityIds); // 디버깅용

    // `options` 정렬
    const sortedOptions = [...allOptions].sort((a, b) => {
      const aPriority = priorityIds.includes(a.id) ? 0 : 1;
      const bPriority = priorityIds.includes(b.id) ? 0 : 1;
      return aPriority - bPriority || b.id - a.id;
    });
    console.log({sortedOptions});
    // 디버깅 출력
    //console.log("Priority IDs:", priorityIds);
    //console.log("Original Options Length:", options.length);
    //console.log("Sorted Options Length:", sortedOptions.length);
    //console.log("Options without Priority:", sortedOptions.filter(opt => !priorityIds.includes(opt.id)));

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