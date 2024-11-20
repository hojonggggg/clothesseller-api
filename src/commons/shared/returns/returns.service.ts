import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets, In } from 'typeorm';
import { Return } from './entities/return.entity';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format';

@Injectable()
export class ReturnsService {
  constructor(
    //private readonly dataSource: DataSource,
    //private readonly productsService: ProductsService,

    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async findAllReturnBySellerIdAndWholesalerId(sellerId: number, wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .leftJoinAndSelect('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('return.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('return.wholesalerProductOption', 'wholesalerProductOption')
      .where('return.sellerId = :sellerId', { sellerId })
      .andWhere('return.wholesalerId = :wholesalerId', { wholesalerId });

    if (query) {
      queryBuilder.andWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
    }

    const [returns, total] = await queryBuilder
      .orderBy('return.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const _return of returns) {
      _return.name = _return.wholesalerProduct.name;
      _return.color = _return.wholesalerProductOption.color;
      _return.size = _return.wholesalerProductOption.size;
      _return.price = formatCurrency(_return.price);
      _return.wholesalerName = _return.wholesalerProfile.name;
      _return.wholesalerStoreName = _return.wholesalerProfile.store.name;
      _return.wholesalerStoreRoomNo = _return.wholesalerProfile.roomNo;
      _return.wholesalerMobile = _return.wholesalerProfile.mobile;
      if (_return.status === '반품신청') {
        _return.status = '확인중';
      }

      delete(_return.type);
      delete(_return.wholesalerId);
      delete(_return.wholesalerProfile);
      delete(_return.wholesalerProductId);
      delete(_return.wholesalerProductOptionId);
      delete(_return.wholesalerProductOption);
      delete(_return.wholesalerProduct);
      delete(_return.sellerId);
      delete(_return.sellerProductId);
      delete(_return.sellerProductOptionId);
      delete(_return.memo);
      delete(_return.isCredit);
      delete(_return.isReceive);
      delete(_return.createdAt);
      delete(_return.receivedAt);
    }
    
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllReturnCreditBySellerId(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .leftJoinAndSelect('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('return.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('return.wholesalerProductOption', 'wholesalerProductOption')
      .where('return.sellerId = :sellerId', { sellerId })
      .andWhere('return.isCredit = :isCredit', { isCredit: true });

      if (query) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
              .orWhere('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` });
          })
        );
      }

      const [returns, total] = await queryBuilder
        .orderBy('return.id', 'DESC')
        .take(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .getManyAndCount();

      for (const _return of returns) {
        _return.name = _return.wholesalerProduct.name;
        _return.color = _return.wholesalerProductOption.color;
        _return.size = _return.wholesalerProductOption.size;
        _return.totalPrice = formatCurrency(_return.price * _return.quantity);
        _return.price = formatCurrency(_return.price);
        _return.wholesalerName = _return.wholesalerProfile.name;
        _return.wholesalerStoreName = _return.wholesalerProfile.store.name;
        _return.wholesalerStoreRoomNo = _return.wholesalerProfile.roomNo;
        if (_return.receivedAt) {
          const creditExtinctDate = new Date(_return.receivedAt);
          creditExtinctDate.setDate(creditExtinctDate.getDate() + 30);
          const formattedDate = `${creditExtinctDate.getFullYear()}/${
            String(creditExtinctDate.getMonth() + 1).padStart(2, '0')}/${
            String(creditExtinctDate.getDate()).padStart(2, '0')}`;
          _return.creditExtinctDate = formattedDate;
        }

        delete(_return.type);
        delete(_return.wholesalerProfile);
        delete(_return.wholesalerProductId);
        delete(_return.wholesalerProduct);
        delete(_return.wholesalerProductOptionId);
        delete(_return.wholesalerProductOption);
        delete(_return.sellerId);
        delete(_return.sellerProductId);
        delete(_return.sellerProductOptionId);
        delete(_return.memo);
        delete(_return.status);
        delete(_return.isCredit);
        delete(_return.isReceive);
        delete(_return.createdAt);
        delete(_return.receivedAt);
      }

      return {
        list: returns,
        total,
        page: Number(pageNumber),
        totalPage: Math.ceil(total / pageSize)
      }
  }

  async _findAllReturnCreditBySellerId(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .select([
        'return.id AS id',
        'SUM(return.quantity * return.price) AS totalPrice',
        'return.wholesalerId AS wholesalerId',
        'wholesalerProfile.name AS wholesalerName',
        'store.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo'
      ])
      .leftJoin('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('wholesalerProfile.store', 'store')
      .where('return.sellerId = :sellerId', { sellerId })
      .andWhere('return.isCredit = :isCredit', { isCredit: true });
      //.groupBy('return.wholesalerId');

    if (query) {
      queryBuilder.andWhere('wholesalerProfile.name LIKE :query', { query: `%${query}%` });
    }

    const [returns, total] = await queryBuilder
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    /*
    const _returns = await queryBuilder.getRawMany();
    const total = _returns.length;
    const returns = _returns.slice(((pageNumber - 1) * pageSize), (pageNumber * pageSize));

    for (const _return of returns) {
      _return.totalPrice = formatCurrency(_return.totalPrice);
    }
    */
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    }
  }

}
