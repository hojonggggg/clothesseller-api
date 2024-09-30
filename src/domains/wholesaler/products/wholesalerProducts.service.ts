import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { SellerProductsService } from 'src/domains/seller/products/sellerProducts.service';
import { SellerRegisterProduct } from 'src/domains/seller/products/entities/seller-register-product.entity';
import { CreateWholesalerProductDto } from './dto/create-wholesaler-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { PaginatedSellerRegisterProducts } from 'src/domains/seller/products/interfaces/paginated-seller-register-products.interface';

@Injectable()
export class WholesalerProductsService {
  constructor(
    private readonly dataSource: DataSource,
    private sellerProductsService: SellerProductsService,

    @InjectRepository(SellerRegisterProduct)
    private sellerRegisterProductRepository: Repository<SellerRegisterProduct>,
    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
  ) {}

  async createWholesalerProduct(wholesalerId: number, createWholesalerProductDto: CreateWholesalerProductDto): Promise<WholesalerProduct> {
    const product = this.wholesalerProductRepository.create({
      wholesalerId,
      ...createWholesalerProductDto
    });
    return this.wholesalerProductRepository.save(product);
  }

  async findSellerRegisterProductsByWholesalerId(wholesalerId: number, paginationQuery: PaginationQueryDto): Promise<PaginatedSellerRegisterProducts> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;

    const [registerProducts, total] = await this.sellerRegisterProductRepository.findAndCount({
      where: { wholesalerId },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: registerProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateSellerRegisterProductStatus(wholesalerId: number, registerProductId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.sellerRegisterProductRepository.update(
        {
          id: registerProductId,
          wholesalerId
        },
        {
          status: 'CONFIRM'
        }
      );

      const registerProduct = await this.sellerProductsService.findOneSellerRegisterProductById(registerProductId);

      const createWholesalerProductDto = {
        productCode: registerProduct.productCode, 
        productName: registerProduct.wholesalerProductName,
        productPrice: registerProduct.wholesalerProductPrice
      };

      await this.createWholesalerProduct(wholesalerId, createWholesalerProductDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
