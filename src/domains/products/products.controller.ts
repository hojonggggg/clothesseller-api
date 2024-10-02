import { BadRequestException, Body, ConflictException, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerProductsService } from './wholesaler/wholesaler.service';
import { SellerProductsService } from './seller/seller.service';
import { WholesalerProduct } from './wholesaler/entities/wholesaler-product.entity';
import { SellerProduct } from './seller/entities/seller-product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly wholesalerProductsService: WholesalerProductsService,
    private readonly sellerProductsService: SellerProductsService
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[관리자 | 도매처 | 셀러] 상품 등록' })
  //@ApiResponse({ status: 200, type: [WholesalerProduct], description: '도매처' })
  //@ApiResponse({ status: 200, type: [SellerProduct], description: '셀러' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req
  ) {
    const { uid, role } = req.user;
    if (role === 'WHOLESALER') {
      const wholesalerId = uid;
      //return this.productRequestsService.findAllProductRequestByWholesalerId(wholesalerId, paginationQuery);
    } else if (role === 'SELLER') {
      const sellerId = uid;
      const { wholesalerProductId } = createProductDto;
      const sellerProduct = await this.sellerProductsService.findOneSellerProductBySellerIdAndWholesalerProductId(sellerId, wholesalerProductId);
      if (sellerProduct) {
        throw new ConflictException('이미 등록된 상품입니다.');
      }
      return this.sellerProductsService.createSellerProduct(sellerId, createProductDto);
    }
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[관리자 | 도매처 | 셀러] 상품 목록 조회' })
  //@ApiResponse({ status: 200, type: [WholesalerProduct], description: '도매처' })
  //@ApiResponse({ status: 200, type: [SellerProduct], description: '셀러' })
  async findAllProducts(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const { uid, role } = req.user;
    if (role === 'WHOLESALER') {
      const wholesalerId = uid;
      //return this.productRequestsService.findAllProductRequestByWholesalerId(wholesalerId, paginationQuery);
    } else if (role === 'SELLER') {
      const sellerId = uid;
      return this.sellerProductsService.findAllSellerProductBySellerId(sellerId, paginationQuery);
    }
  }
  
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[관리자 | 도매처 | 셀러] 상품 검색' })
  @ApiQuery({ name: 'type', description: 'my(셀러가 내꺼 검색) OR wholesaler(상품 등록할 때 도매처 상품 검색, wholesalerId 필요)' })
  @ApiQuery({ name: 'wholesalerId', required: false, description: '도매처 ID' })
  async searchProduct(
    @Query() paginationQuery: PaginationQueryDto, 
    @Query('type') type: string,
    @Query('wholesalerId') wholesalerId: number,
    @Query('productName') productName: string,
    @Request() req
  ) {
    const { uid, role } = req.user;
    const userRole = role;
    if (userRole === 'WHOLESALER') {
    } else if (userRole === 'SELLER') {
      const sellerId = uid;
      if (type === 'my') {
        return await this.sellerProductsService.searchSellerProductBySellerId(sellerId, productName, paginationQuery);
      } else if (type === 'wholesaler') {
        if (!wholesalerId) {
          throw new BadRequestException('wholesalerId를 입력해 주세요.');
        }
        return await this.wholesalerProductsService.searchWholesalerProductByWholesalerId(wholesalerId, productName, paginationQuery);
      }
    }
  }



}
