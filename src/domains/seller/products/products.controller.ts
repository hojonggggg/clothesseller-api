import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerProductsService } from './products.service';
import { SellerProduct } from './entities/seller-product.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > products')
@Controller('seller/products')
export class SellerProductsController {
  constructor(
    private readonly sellerProductsService: SellerProductsService
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[옵션 추가 필요] 상품 등록' })
  @ApiResponse({ status: 201, type: SellerProduct })
  async createSellerProduct(
    @Body() createSellerProductDto: CreateSellerProductDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { wholesalerProductId } = createSellerProductDto;
    const product = await this.sellerProductsService.findOneSellerProductBySellerIdAndWholesalerProductId(sellerId, wholesalerProductId);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    return await this.sellerProductsService.createSellerProduct(sellerId, createSellerProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[검색 추가 필요] 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [SellerProduct] })
  async findAllSellerProductBySellerId(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    return await this.sellerProductsService.findAllSellerProductBySellerId(sellerId, paginationQuery);
  }
  
}
