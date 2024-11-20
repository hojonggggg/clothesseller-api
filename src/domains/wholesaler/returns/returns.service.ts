import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { Return } from 'src/commons/shared/entities/return.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@Injectable()
export class WholesalerReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async findAllReturn(wholesalerId: number, isReceive: boolean, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.returnRepository.createQueryBuilder('return')
      .leftJoinAndSelect('return.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('return.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('return.sellerProfile', 'sellerProfile')
      .leftJoinAndSelect('sellerProfile.deliveryman', 'deliveryman')
      .where('return.wholesalerId = :wholesalerId', { wholesalerId });
      //.andWhere('return.isReceive = :isReceive', { isReceive });
    
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :wholesalerProductName', { wholesalerProductName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` });
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
      _return.sellerName = _return.sellerProfile.name;
      _return.sellerMobile = _return.sellerProfile.mobile;
      if (_return.sellerProfile.deliveryman) {
        _return.deliverymanMobile = _return.sellerProfile.deliveryman.mobile;
      } else {
        _return.deliverymanMobile = null;
      }
      const createdDate = new Date(_return.createdAt);
      const returnDate = `${createdDate.getFullYear()}/${(createdDate.getMonth() + 1).toString().padStart(2, '0')}/${createdDate.getDate().toString().padStart(2, '0')}`;
      _return.returnDate = returnDate;

      delete(_return.wholesalerId);
      delete(_return.wholesalerProductId);
      delete(_return.wholesalerProduct);
      delete(_return.wholesalerProductOptionId);
      delete(_return.wholesalerProductOption);
      delete(_return.sellerId);
      delete(_return.sellerProfile);
      delete(_return.sellerProductId);
      delete(_return.sellerProductOptionId);
      delete(_return.isCredit);
      delete(_return.createdAt);
    }
    
    return {
      list: returns,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async returnsApproval(wholesalerId: number, ids: number[]): Promise<void> {
    await this.returnRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isCredit: true,
        isReceive: true,
        status: '반품승인'
      }
    );
  }

  async returnsReject(wholesalerId: number, ids: number[]): Promise<void> {
    await this.returnRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isReceive: true,
        status: '반품불가'
      }
    );
  }
}
