import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Return } from 'src/commons/shared/entities/return.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class SellerReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async findAllReturnBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    /*
    const [returns, total] = await this.returnRepository.findAndCount({
      where: { sellerId },
      //relations: ['sellerProductOption', 'sellerProductOption.sellerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */
    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      //.leftJoinAndSelect('return.sellerProduct', 'sellerProduct')
      //.leftJoinAndSelect('return.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('return.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('return.wholesalerProductOption', 'wholesalerProductOption')
      .where('return.sellerId = :sellerId', { sellerId })
      .andWhere('return.isCredit = :isCredit', { isCredit: false });

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
     
      delete(_return.status);
      delete(_return.wholesalerId);
      delete(_return.wholesalerProfile);
      delete(_return.wholesalerProductId);
      delete(_return.wholesalerProductOptionId);
      delete(_return.wholesalerProductOption);
      delete(_return.wholesalerProduct);
      delete(_return.sellerId);
      delete(_return.sellerProductId);
      delete(_return.sellerProductOptionId);
      //delete(_return.sellerProductOption);
      //delete(_return.sellerProduct);
    }
    
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllReturnCreditBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    /*
    const [returns, total] = await this.returnRepository.findAndCount({
      where: { sellerId },
      //relations: ['sellerProductOption', 'sellerProductOption.sellerProduct', 'wholesalerProfile', 'wholesalerProfile.store'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */
    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      //.leftJoinAndSelect('return.sellerProduct', 'sellerProduct')
      //.leftJoinAndSelect('return.sellerProductOption', 'sellerProductOption')
      .leftJoinAndSelect('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('return.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('return.wholesalerProductOption', 'wholesalerProductOption')
      .where('return.sellerId = :sellerId', { sellerId })
      .andWhere('return.isCredit = :isCredit', { isCredit: true });

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
     
      delete(_return.status);
      delete(_return.wholesalerId);
      delete(_return.wholesalerProfile);
      delete(_return.wholesalerProductId);
      delete(_return.wholesalerProductOptionId);
      delete(_return.wholesalerProductOption);
      delete(_return.wholesalerProduct);
      delete(_return.sellerId);
      delete(_return.sellerProductId);
      delete(_return.sellerProductOptionId);
      //delete(_return.sellerProductOption);
      //delete(_return.sellerProduct);
    }
    
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllPickupOfFromSellerBySellerId(sellerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .select([
        'return.id AS returnId',
        'wholesalerProfile.storeId AS wholesalerStoreId',
        'wholesalerProfile.name AS wholesalerName',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'return.status AS status',
        'DATE_FORMAT(return.createdAt, "%y/%m/%d/%H:%i") AS returnDate',
      ])
      .leftJoin('return.wholesalerProfile', 'wholesalerProfile')
      .leftJoin('wholesalerProfile.store', 'wholesalerStore')
      .where('return.sellerId = :sellerId', { sellerId })

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` });
        })
      );
    }
    
    const pickups = await queryBuilder
      .orderBy('return.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getRawMany();
    
    const total = await this.returnRepository
      .createQueryBuilder('return')
      .where('return.sellerId = :sellerId', { sellerId })
      .getCount();

    const groupedPickups = pickups.reduce((acc, current) => {
      const storeId = current.wholesalerStoreId;
      if (!acc[storeId]) {
        acc[storeId] = {
          wholesalerStoreId: storeId,
          wholesalerStoreName: current.wholesalerStoreName,
          returns: []
        };
      }
      const isPickup = (current.status === '픽업') ? 'O' : 'X';
      acc[storeId].returns.push({
        id: current.returnId,
        wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
        wholesalerName: current.wholesalerName,
        returnDate: current.returnDate,
        isPickup
      });
      return acc;
    }, {});
  
    const result = Object.values(groupedPickups);

    return {
      list: result,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
