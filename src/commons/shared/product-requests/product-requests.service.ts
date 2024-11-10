import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Brackets } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { ProductRequest } from './entities/product-request.entity';
import { ProductRequestOption } from './entities/product-request-option.entity';
import { ApproveProductRequestDto } from './dto/approve-product-request.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { formatCurrency } from '../functions/format';

@Injectable()
export class ProductRequestsService {
  constructor(
    private readonly dataSource: DataSource,
    private productsService: ProductsService,
    
    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
    @InjectRepository(ProductRequestOption)
    private productRequestOptionRepository: Repository<ProductRequestOption>,
    /*
    @InjectRepository(WholesalerProduct)
    private wholesalerProductRepository: Repository<WholesalerProduct>,
    @InjectRepository(WholesalerProductOption)
    private wholesalerProductOptionRepository: Repository<WholesalerProductOption>,
    @InjectRepository(SellerProduct)
    private sellerProductRepository: Repository<SellerProduct>,
    @InjectRepository(SellerProductOption)
    private sellerProductOptionRepository: Repository<SellerProductOption>,
    */
  ) {}

  async findAllProductRequestForAdmin(query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .leftJoinAndSelect('productRequest.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('productRequest.sellerProfile', 'sellerProfile')
      .where('productRequest.isDeleted = 0')
      .andWhere('options.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('productRequest.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` });
        })
      );
    }

    const [requests, total] = await queryBuilder
      .orderBy('productRequest.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const request of requests) {
      const { wholesalerProfile, sellerProfile, options } = request;
      //request.sellerName = request.sellerProfile.name;
      wholesalerProfile.storeName = wholesalerProfile.store.name;
      const { address1, address2 } = sellerProfile;
      const address = address1 + " " + address2;
      sellerProfile.address = address;
      request.price = formatCurrency(request.price);


      for (const option of options) {
        option.price = formatCurrency(option.price);
        delete(option.productRequestId);
        delete(option.isDeleted);
      }

      delete(request.wholesalerId);
      delete(request.wholesalerProfile.storeId);
      delete(request.wholesalerProfile.store);
      delete(request.sellerId);
      delete(request.sellerProfile.address1);
      delete(request.sellerProfile.address2);
      delete(request.isDeleted);
      delete(request.status);
    }

    return {
      list: requests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findAllProductRequestForWholesaler(wholesalerId: number, query: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .leftJoinAndSelect('productRequest.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('productRequest.sellerProfile', 'sellerProfile')
      .where('productRequest.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('productRequest.isDeleted = 0')
      .andWhere('options.isDeleted = 0');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('productRequest.name LIKE :productName', { productName: `%${query}%` })
            .orWhere('wholesalerProfile.name LIKE :wholesalerName', { wholesalerName: `%${query}%` })
            .orWhere('sellerProfile.name LIKE :sellerName', { sellerName: `%${query}%` });
        })
      );
    }

    const [requests, total] = await queryBuilder
      .orderBy('productRequest.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
      
    for (const request of requests) {
      const { wholesalerProfile, sellerProfile, options } = request;
      //request.sellerName = request.sellerProfile.name;
      wholesalerProfile.storeName = wholesalerProfile.store.name;
      const { address1, address2 } = sellerProfile;
      const address = address1 + " " + address2;
      sellerProfile.address = address;
      request.price = formatCurrency(request.price);


      for (const option of options) {
        option.price = formatCurrency(option.price);
        delete(option.productRequestId);
        delete(option.isDeleted);
      }

      delete(request.wholesalerId);
      delete(request.wholesalerProfile.storeId);
      delete(request.wholesalerProfile.store);
      delete(request.sellerId);
      delete(request.sellerProfile.address1);
      delete(request.sellerProfile.address2);
      delete(request.isDeleted);
      delete(request.status);
    }

    return {
      list: requests,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize)
    }
  }

  async findOneProductRequest(productRequestId: number) {
    const queryBuilder = this.productRequestRepository.createQueryBuilder('productRequest')
      .leftJoinAndSelect('productRequest.options', 'options')
      .leftJoinAndSelect('productRequest.wholesalerProfile', 'wholesalerProfile')
      .leftJoinAndSelect('wholesalerProfile.store', 'store')
      .leftJoinAndSelect('productRequest.sellerProfile', 'sellerProfile')
      .where('productRequest.id = :productRequestId', { productRequestId })
      .andWhere('options.isDeleted = 0');

    const productRequest = await queryBuilder.getOne();

    const { options } = productRequest;
    for (const option of options) {
      option.price = formatCurrency(option.price);
      delete(option.productRequestId);
      delete(option.isDeleted);
    }
    /*
    productRequest.sellerName = productRequest.sellerProfile.name;
    const sellerAddress1 = productRequest.sellerProfile.address1;
    const sellerAddress2 = productRequest.sellerProfile.address2;
    productRequest.sellerAddress = sellerAddress1 + " " + sellerAddress2;
    productRequest.sellerMobile = productRequest.sellerProfile.mobile;
    */

    
    const { wholesalerProfile, sellerProfile } = productRequest;
    wholesalerProfile.storeName = wholesalerProfile.store.name;
    const { address1, address2 } = sellerProfile;
    const address = address1 + " " + address2;
    sellerProfile.address = address;
    productRequest.price = formatCurrency(productRequest.price);

    delete(productRequest.wholesalerId);
    delete(productRequest.wholesalerProfile.storeId);
    delete(productRequest.wholesalerProfile.store);
    delete(productRequest.sellerId);
    delete(productRequest.sellerProfile.address1);
    delete(productRequest.sellerProfile.address2);
    delete(productRequest.isDeleted);

    return productRequest;
  }

  async approveProductRequest(userId: number, productRequestId: number, approveProductRequestDto: ApproveProductRequestDto): Promise<void> {
    const { wholesalerId, name } = approveProductRequestDto;
    const product = await this.productsService.findOneWholesalerProductByWholesalerIdAndName(wholesalerId, name);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.productsService.createWholesalerProduct(approveProductRequestDto);
      await this.productRequestRepository.update(
        {
          id: productRequestId,
          isApprove: false
        }, {
          isApprove: true,
          approveUserId: userId,
          status: '등록완료'
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
