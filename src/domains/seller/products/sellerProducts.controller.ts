import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerProductsService } from './sellerProducts.service';
import { SellerProduct } from './entities/seller-product.entity';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { WholesalerProduct } from 'src/domains/wholesaler/products/entities/wholesaler-product.entity';

@ApiTags('seller > products')
@Controller('seller')
export class SellerProductsController {
  constructor(
    private readonly sellerProductsService: SellerProductsService
  ) {}
  /*
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
  */

}
