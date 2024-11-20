import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Return } from 'src/commons/shared/returns/entities/return.entity';
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
      .where('return.sellerId = :sellerId', { sellerId });
      //.andWhere('return.isCredit = :isCredit', { isCredit: false });

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
      //delete(_return.status);
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
      const { quantity, price } = _return;
      const totalPrice = quantity * price;
      _return.price = formatCurrency(totalPrice);
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
      delete(_return.quantity);
      delete(_return.memo);
      delete(_return.isCredit);
      delete(_return.isReceive);
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
        'wholesalerProfile.id AS wholesalerId',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'return.status AS status',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'DATE_FORMAT(return.createdAt, "%y/%m/%d/%H:%i") AS returnDate'
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
    
    const totalQuery = this.returnRepository.createQueryBuilder('return')
      .select([
        'return.id AS returnId',
        'wholesalerProfile.storeId AS wholesalerStoreId',
        'wholesalerProfile.name AS wholesalerName',
        'wholesalerProfile.id AS wholesalerId',
        'wholesalerStore.name AS wholesalerStoreName',
        'wholesalerProfile.roomNo AS wholesalerStoreRoomNo',
        'return.status AS status',
        'DATE_FORMAT(return.createdAt, "%y/%m/%d/%H:%i") AS returnDate'
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
    
    //const total = await totalQuery.getCount();
    let totalWholesalerIds = new Set();

    const groupedPickups = pickups.reduce((acc, current) => {
      const storeId = current.wholesalerStoreId;
      const wholesalerId = current.wholesalerId;

      // 첫 번째 그룹화 (wholesalerStoreId)
      if (!acc[storeId]) {
        acc[storeId] = {
          wholesalerStoreId: storeId,
          wholesalerStoreName: current.wholesalerStoreName,
          wholesalers: []
        };
      }

      // 두 번째 그룹화 (wholesalerId)
      const wholesalerGroup = acc[storeId].wholesalers.find(w => w.wholesalerId === wholesalerId);
      if (!wholesalerGroup) {
        acc[storeId].wholesalers.push({
          wholesalerId: wholesalerId,
          wholesalerName: current.wholesalerName,
          wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
          //orders: []
          orderDate: '24/10/08/22:00',
          isPickup: 'X'
        });
      }
      /*
      const groupIndex = acc[storeId].wholesalers.findIndex(w => w.wholesalerId === wholesalerId);
      acc[storeId].wholesalers[groupIndex].orders.push({
        returnId: current.returnId,
        wholesalerStoreRoomNo: current.wholesalerStoreRoomNo,
        status: current.status,
        returnDate: current.returnDate
      });
      */
      totalWholesalerIds.add(wholesalerId);

      return acc;
    }, {});
  
    const result = Object.values(groupedPickups);
    const total = totalWholesalerIds.size;

    return {
      list: result,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }
}
