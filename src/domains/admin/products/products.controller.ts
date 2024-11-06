import { Controller, Get, Query, UseGuards, Param, Post, Body, ConflictException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { CreateWholesalerProductDtoFromAdmin } from 'src/commons/shared/products/dto/create-wholesaler-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > products')
@Controller('admin')
export class AdminProductsController {
  constructor(
    private productsService: ProductsService
  ) {}
  
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  @ApiQuery({ name: 'query', required: false, description: '(도매처명 or 셀러명) or 상품명' })
  async findAllProduct(
    @Query('type') type: string,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.productsService.findAllWholesalerProductForAdmin(query, paginationQueryDto);
    } else if (type === 'SELLER') {
      result = await this.productsService.findAllSellerProductForAdmin(query, paginationQueryDto);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('product/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  async findOneWholesalerProduct(
    @Param('productId') productId: number, 
    @Query('type') type: string
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.productsService.findOneWholesalerProductById(productId);
    } else if (type === 'SELLER') {
      result = await this.productsService.findOneSellerProductById(productId);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }

  @Post('product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 도매처 상품 등록' })
  @ApiResponse({ status: 201 })
  async createWholesalerProduct(
    @Body() createWholesalerProductDto: CreateWholesalerProductDtoFromAdmin, 
  ) {
    const { wholesalerId, name } = createWholesalerProductDto;
    const product = await this.productsService.findOneWholesalerProductByWholesalerIdAndName(wholesalerId, name);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    await this.productsService.createWholesalerProduct(createWholesalerProductDto);
    return {
      statusCode: 201,
      message: '상품 등록이 완료되었습니다.'
    };
  }

}
