import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets, In } from 'typeorm';
import { Sample } from 'src/commons/shared/samples/entities/sample.entity';
import { WholesalerCreateSampleAutoDto } from './dto/wholesaler-create-sample-auto.dto';
import { WholesalerCreateSampleManualDto } from './dto/wholesaler-create-sample-manual.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { getStartAndEndDate } from 'src/commons/shared/functions/date';

@Injectable()
export class WholesalerSamplesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async createSampleAuto(wholesalerId: number, wholesalerCreateSampleAutoDto: WholesalerCreateSampleAutoDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { options } = wholesalerCreateSampleAutoDto;
      for (const option of options) {
        const sample = this.sampleRepository.create({
          wholesalerId, 
          sellerType: 'AUTO',
          ...wholesalerCreateSampleAutoDto,
          wholesalerProductOptionId: option.wholesalerProductOptionId,
          quantity: option.quantity
        });
        await this.sampleRepository.save(sample);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createSampleManual(wholesalerId: number, wholesalerCreateSampleManualDto: WholesalerCreateSampleManualDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { options } = wholesalerCreateSampleManualDto;
      for (const option of options) {
        const sample = this.sampleRepository.create({
          wholesalerId, 
          sellerType: 'MANUAL',
          ...wholesalerCreateSampleManualDto,
          wholesalerProductOptionId: option.wholesalerProductOptionId,
          quantity: option.quantity
        });
        await this.sampleRepository.save(sample);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllSample(wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .leftJoinAndSelect('sample.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('sample.wholesalerProductOption', 'wholesalerProductOption')
      .leftJoinAndSelect('sample.sellerProfile', 'sellerProfile')
      .where('sample.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('sample.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('wholesalerProduct.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('COALESCE(sample.sellerName, sellerProfile.name) LIKE :sellerName', { sellerName: `%${query}%` });
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
      if (sample.sellerType === 'AUTO') {
        sample.sellerName = sample.sellerProfile.name;
        const sellerAddress1 = sample.sellerProfile.address1;
        const sellerAddress2 = sample.sellerProfile.address2;
        sample.sellerAddress = sellerAddress1 + " " + sellerAddress2;
        sample.sellerMobile = sample.sellerProfile.mobile;
        if (sample.sellerProfile.deliveryman) {
          sample.deliverymanMobile = sample.sellerProfile.deliveryman.mobile;
        } else {
          sample.deliverymanMobile = null;
        }
      }
      delete(sample.wholesalerId);
      delete(sample.sellerType);
      delete(sample.sellerId);
      delete(sample.isDeleted);
      delete(sample.status);
      delete(sample.wholesalerProduct);
      delete(sample.wholesalerProductOption);
      delete(sample.sellerProfile);
    }
    
    return {
      list: samples,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findAllSampleOfMonthly(wholesalerId: number, month: string) {
    const { startDate, endDate } = getStartAndEndDate(month);
    
    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .select([
        'sample.id AS sampleId',
        'wholesalerProduct.name AS wholesalerProductName',
        'sample.quantity AS quantity',
        'sample.sampleDate AS sampleDate',
        'sample.returnDate AS returnDate',
        `IF(sample.sellerType = 'AUTO', sellerProfile.name, sample.sellerName) AS sellerName`
      ])
      .leftJoin('sample.sellerProfile', 'sellerProfile')
      .leftJoin('sample.wholesalerProduct', 'wholesalerProduct')
      .where('sample.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('STR_TO_DATE(sample.returnDate, "%Y/%m/%d") BETWEEN STR_TO_DATE(:startDate, "%Y/%m/%d") AND STR_TO_DATE(:endDate, "%Y/%m/%d")', {
        startDate,
        endDate
      });

    const rawSamples = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .getRawMany();
    
    const samples = rawSamples.reduce((acc, result) => {
      const { sampleId, sampleDate, quantity, returnDate, wholesalerProductName, sellerName } = result;
    
      // 이미 그룹이 존재하는지 확인
      let dateGroup = acc.find(group => group.returnDate === returnDate);
      
      if (!dateGroup) {
        // 그룹이 없으면 새로 생성
        dateGroup = { returnDate, samples: [] };
        acc.push(dateGroup);
      }
    
      // 샘플 추가
      dateGroup.samples.push({ id: sampleId, name: wholesalerProductName, quantity, sellerName, sampleDate, returnDate });
    
      return acc;
    }, []);

    return samples;
  }

  async findAllSampleOfDaily(wholesalerId: number, day: string) {
    const queryBuilder = this.sampleRepository.createQueryBuilder('sample')
      .select([
        'sample.id AS sampleId',
        'wholesalerProduct.name AS name',
        'sample.quantity AS quantity',
        'sample.sampleDate AS sampleDate',
        'sample.returnDate AS returnDate',
        `IF(sample.sellerType = 'AUTO', sellerProfile.name, sample.sellerName) AS sellerName`
      ])
      .leftJoin('sample.sellerProfile', 'sellerProfile')
      .leftJoin('sample.wholesalerProduct', 'wholesalerProduct')
      .where('sample.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('sample.sampleDate = :day', { day })
            .orWhere('sample.returnDate = :day', { day })
        })
      );

    const samples = await queryBuilder
      .orderBy('sample.id', 'DESC')
      .getRawMany();

    return samples;
  }

  async returnSamples(wholesalerId: number, ids: number[]): Promise<void> {
    await this.sampleRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isReturned: true
      }
    );
  }

  async deleteSamples(wholesalerId: number, ids: number[]): Promise<void> {
    await this.sampleRepository.update(
      {
        id: In(ids),
        wholesalerId
      }, {
        isDeleted: true
      }
    );
  }
}
