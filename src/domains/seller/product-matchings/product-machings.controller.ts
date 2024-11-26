import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { ProductMatchingsService } from 'src/commons/shared/product-matchings/product-matchings.service';
import { ProductMatchingDto } from 'src/commons/shared/product-matchings/dto/product-matching.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > product-matchings')
@Controller('seller')
export class SellerProductMatchingsController {
  constructor(
    private productsService: ProductsService,
    private productMatchingsService: ProductMatchingsService
  ) {}
  
  @Get('product-matchings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 셀러 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'mallId', required: true, description: '판매몰 ID' })
  @ApiQuery({ name: 'query', required: false, description: '상품명' })
  async findAllSellerProduct(
    @Request() req,
    @Query('query') query: string,
    @Query('mallId') mallId: number,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const sellerId = req.user.uid;
    const result = await this.productMatchingsService.findAllSellerProductOptionForSeller(sellerId, mallId, query, paginationQueryDto);

    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('product-matchings/wholesaler')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 도매처 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '도매처명 or 상품명' })
  async findAllWholesalerProduct(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const result = await this.productsService.findAllWholesalerProductOption(query, paginationQueryDto);

    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Post('product-matching/:sellerProductOptionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 매칭' })
  @ApiResponse({ status: 200 })
  async matching(
    @Param('sellerProductOptionId') sellerProductOptionId: number, 
    @Body() productMatchingDto: ProductMatchingDto, 
    @Request() req,
  ) {
    const sellerId = req.user.uid;
    const result = await this.productMatchingsService.productMatching(sellerId, sellerProductOptionId, productMatchingDto);

    return {
      statusCode: 200,
      message: '상품 옵션 매칭이 완료되었습니다.'
    };
  }
  

}
