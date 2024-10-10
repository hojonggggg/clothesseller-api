import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '[완료] 상품 등록' })
  @ApiResponse({ status: 201 })
  async createSellerProduct(
    @Body() createSellerProductDto: CreateSellerProductDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { mallId, wholesalerProductId } = createSellerProductDto;
    const product = await this.sellerProductsService.findOneSellerProductBySellerIdAndMallIdAndWholesalerProductId(sellerId, mallId, wholesalerProductId);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    await this.sellerProductsService.createSellerProduct(sellerId, createSellerProductDto);
    return {
      statusCode: 201,
      message: '상품 등록이 완료되었습니다.'
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllSellerProductBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    //return await this.sellerProductsService.findAllSellerProductBySellerId(sellerId, productName, paginationQuery);
    const result = await this.sellerProductsService.findAllSellerProductBySellerId(sellerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }
  
}
