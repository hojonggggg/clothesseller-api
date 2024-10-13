import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerProductsService } from './products.service';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { UpdateSellerProductDto } from './dto/update-seller-product.dto';
import { ReturnSellerProductDto } from './dto/return-seller-product.dto';
import { DeleteSellerProductDto } from './dto/delete-seller-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > products')
@Controller('seller/products')
export class SellerProductsController {
  constructor(
    private readonly sellerProductsService: SellerProductsService
  ) {}

  @Get('summary/:mallId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 상품 요약' })
  @ApiResponse({ status: 200 })
  async summarySellerProduct(
    @Param('mallId') mallId: number, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.sellerProductsService.summarySellerProduct(sellerId, mallId);
    return {
      statusCode: 200,
      data: result
    };
  }

  
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 조회' })
  @ApiResponse({ status: 200 })
  async findOneSellerProductBySellerProductId(
    @Param('id') sellerProductId: number, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.sellerProductsService.findOneSellerProductBySellerProductId(sellerId, sellerProductId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 수정' })
  @ApiResponse({ status: 200 })
  async updateSellerProduct(
    @Param('id') sellerProductId: number, 
    @Body() updateSellerProductDto: UpdateSellerProductDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.sellerProductsService.updateSellerProduct(sellerId, sellerProductId, updateSellerProductDto);
    return {
      statusCode: 200,
      message: '상품 수정이 완료되었습니다.'
    };
  }

  @Patch('return')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 반품' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
        },
      },
    },
  })
  async returnSellerProduct(
    @Body() returnSellerProductDtos: ReturnSellerProductDto[], 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerProductsService.returnSellerProduct(sellerId, returnSellerProductDtos);
    return {
      statusCode: 200,
      message: '상품 반납 신청이 완료되었습니다.'
    };
  }

  @Delete()  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 삭제' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
        },
      },
    },
  })
  async deleteSellerProduct(
    @Body() deleteSellerProductDtos: DeleteSellerProductDto[], 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerProductsService.deleteSellerProduct(sellerId, deleteSellerProductDtos);
    return {
      statusCode: 200,
      message: '상품 삭제가 완료되었습니다.'
    };
  }
}
