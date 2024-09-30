import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerProductsService } from './sellerProducts.service';
import { SellerProduct } from './entities/seller-product.entity';
import { SellerRegisterProduct } from './entities/seller-register-product.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { CreateSellerRegisterProductDto } from './dto/create-seller-register-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';

@ApiTags('seller > products')
@Controller('seller')
export class SellerProductsController {
  constructor(
    private readonly sellerProductsService: SellerProductsService
  ) {}

  @Post('register-product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '도매처 상품 등록 요청' })
  @ApiResponse({ status: 201, type: SellerProduct })
  async createSellerRegisterProduct(
    @Body() createSellerRegisterProductDto: CreateSellerRegisterProductDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { productCode } = createSellerRegisterProductDto;
    const sellerRegisterProduct = await this.sellerProductsService.findOneSellerRegisterProductBySellerIdAndProductCode(sellerId, productCode);
    if (sellerRegisterProduct) {
      throw new ConflictException('이미 도매처 등록 요청된 상품입니다.');
    }
    return this.sellerProductsService.createSellerRegisterProduct(sellerId, createSellerRegisterProductDto);
  }

  @Get('register-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '도매처 등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [SellerRegisterProduct] })
  async findSellerRegisterProducts(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    return this.sellerProductsService.findSellerRegisterProductsBySellerId(sellerId, paginationQuery);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발중] 도매처 상품 검색' })
  @ApiResponse({ status: 200, type: [WholesalerProduct] })
  @ApiQuery({ name: 'productName' })
  async findWholesalerProductsByProductName(

  ) {
    
  }

  @Post('product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '셀러 상품 등록' })
  @ApiResponse({ status: 201, type: SellerProduct })
  async createSellerProduct(
    @Body() createSellerProductDto: CreateSellerProductDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { wholesalerProductId } = createSellerProductDto;
    const sellerProduct = await this.sellerProductsService.findOneSellerProductBySellerIdAndWholesalerProductId(sellerId, wholesalerProductId);
    if (sellerProduct) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    return this.sellerProductsService.createSellerProduct(sellerId, createSellerProductDto);
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '셀러 등록 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [SellerProduct] })
  async findSellerProducts(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const { userUid } = req.user;
    return this.sellerProductsService.findSellerProductsBySellerId(userUid, paginationQuery);
  }
  

}
