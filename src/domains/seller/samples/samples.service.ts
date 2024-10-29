import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets, In } from 'typeorm';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { Return } from 'src/commons/shared/entities/return.entity';
import { SellerCreateSampleDto } from './dto/seller-create-sample.dto';
import { SellerDeleteSampleDto } from './dto/seller-delete-sample.dto';
import { SellerReturnSampleDto } from './dto/seller-return-sample.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { getStartAndEndDate } from 'src/commons/shared/functions/date';

@Injectable()
export class SellerSamplesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
  ) {}

  async createSample(sellerId: number, sellerCreateSampleDto: SellerCreateSampleDto): Promise<Sample[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    const samples: Sample[] = [];

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { options } = sellerCreateSampleDto;
      for (const option of options) {
        const sample = this.sampleRepository.create({
          sellerId, 
          ...sellerCreateSampleDto, 
          wholesalerProductOptionId: option.wholesalerProductOptionId,
          quantity: option.quantity
        });
        const savedSample = await this.sampleRepository.save(sample);
        samples.push(savedSample);
      }

      await queryRunner.commitTransaction();
      return samples.reverse();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllSampleBySellerId(sellerId: number, query: string, paginationQuery: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQuery;
    /*
    const whereConditions: any = { sellerId };
    if (productName) {
      whereConditions.productName = Like(`%${productName}%`);
    }

    const [samples, total] = await this.sampleRepository.findAndCount({
      where: whereConditions,
      relations: ['wholesalerProfile', 'wholesalerProfile.store', 'wholesalerProduct', 'wholesalerProductOption'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    */

    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .where('sample.sellerId = :sellerId', { sellerId })
      .andWhere('sample.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sample.sampleDate = :date', { date: query })
            .orWhere('sample.returnDate = :date', { date: query });
        })
      );
    }

    const [samples, total] = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const sample of samples) {
      sample.name = sample.wholesalerProduct.name;
      sample.color = sample.wholesalerProductOption.color;
      sample.size = sample.wholesalerProductOption.size;
      sample.wholesalerName = sample.wholesalerProfile.name;
      sample.wholesalerStoreName = sample.wholesalerProfile.store.name;
      sample.wholesalerStoreRoomNo = sample.wholesalerProfile.roomNo;
      sample.wholesalerMobile = sample.wholesalerProfile.mobile;
      
      delete(sample.sellerId);
      delete(sample.wholesalerId);
      delete(sample.wholesalerProfile);
      delete(sample.wholesalerProductId);
      delete(sample.wholesalerProduct);
      delete(sample.wholesalerProductOptionId);
      delete(sample.wholesalerProductOption);
    }
    
    return {
      list: samples,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async deleteSample(sellerId: number, ids: number[]): Promise<void> {
    /*
    for (const sellerDeleteSampleDto of sellerDeleteSampleDtos) {
      const sampleId = sellerDeleteSampleDto.id;

      await this.sampleRepository.update(
        {
          id: sampleId,
          sellerId
        }, {
          isDeleted: true
        }
      );
    }
    */
    await this.sampleRepository.update(
      {
        id: In(ids),
        sellerId
      }, {
        isDeleted: true
      }
    );
  }

  async returnSample(sellerId: number, ids: number[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    
      for (const sampleId of ids) {
        //const sampleId = sellerReturnSampleDto.id;

        await this.sampleRepository.update(
          {
            id: sampleId,
            sellerId
          }, {
            status: '반납'
          }
        );

        const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
          .where('sample.id = :sampleId', { sampleId });
        const sample = await queryBuilder.getOne();
        const { wholesalerId, wholesalerProductId, wholesalerProductOptionId, quantity } = sample;

        const returnProduct = this.returnRepository.create({
          type: '샘플상품',
          wholesalerId,
          wholesalerProductId,
          wholesalerProductOptionId,
          sellerId,
          sellerProductId: 0,
          sellerProductOptionId: 0,
          quantity,
          price: 0
        });

        await this.returnRepository.save(returnProduct);

      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllSampleOfMonthlyBySellerId(sellerId: number, month: string) {
    const { startDate, endDate } = getStartAndEndDate(month);
    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .select([
        'sample.id AS sampleId',
        'sample.quantity AS quantity',
        'sample.sampleDate AS sampleDate',
        'sample.returnDate AS returnDate',
        'wholesalerProduct.name AS wholesalerProductName',
        'wholesalerProfile.name AS wholesalerName',
      ])
      .leftJoin('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoin('sample.wholesalerProfile', 'wholesalerProfile')
      .where('sample.sellerId = :sellerId', { sellerId })
      .andWhere('STR_TO_DATE(sample.returnDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
        startDate,
        endDate
      });

    const rawSamples = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .getRawMany(); // 원시 데이터 가져오기
    //return results;
    
    const samples = rawSamples.reduce((acc, result) => {
      const { sampleId, sampleDate, quantity, returnDate, wholesalerProductName, wholesalerName } = result;
    
      // 이미 그룹이 존재하는지 확인
      let dateGroup = acc.find(group => group.returnDate === returnDate);
      
      if (!dateGroup) {
        // 그룹이 없으면 새로 생성
        dateGroup = { returnDate, samples: [] };
        acc.push(dateGroup);
      }
    
      // 샘플 추가
      dateGroup.samples.push({ id: sampleId, name: wholesalerProductName, quantity, wholesalerName, sampleDate, returnDate });
    
      return acc;
    }, []);
    
    return samples;
  }

  async findAllSampleOfDailyBySellerId(sellerId: number, day: string) {
      const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
        .select([
          'sample.id AS id',
          'sample.quantity AS quantity',
          'sample.sampleDate AS sampleDate',
          'sample.returnDate AS returnDate',
          'wholesalerProduct.name AS name',
          'wholesalerProfile.name AS wholesalerName',
        ])
        .leftJoin('sample.wholesalerProduct', 'wholesalerProduct')
        .leftJoin('sample.wholesalerProfile', 'wholesalerProfile')
        .where('sample.sellerId = :sellerId', { sellerId })
        .andWhere('sample.sampleDate = :day', { day });

    const samples = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .getRawMany();

    return samples;
  }
}
