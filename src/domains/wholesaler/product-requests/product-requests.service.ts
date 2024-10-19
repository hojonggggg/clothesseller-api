import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';


@Injectable()
export class ProductRequestsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
  ) {}

  async approveProductRequest(wholesalerId: number, productRequestId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.productRequestRepository.update(
        {
          id: productRequestId,
          wholesalerId,
          status: '승인대기'
        }, {
          status: '승인완료'
        }
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
