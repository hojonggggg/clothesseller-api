import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { DeleteProductRequestDto } from './dto/delete-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > product-requests')
@Controller('seller')
export class ProductRequestsController {
  constructor(
    private readonly productRequestsService: ProductRequestsService,
    private readonly wholesalerProductsService: WholesalerProductsService
  ) {}

  @Post('product-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청' })
  @ApiResponse({ status: 201 })
  async createProductRequest(
    @Body() createProductRequestDto: CreateProductRequestDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { wholesalerId, code } = createProductRequestDto;
    const productRequest = await this.productRequestsService.findOneProductRequestByWholesalerIdAndCode(wholesalerId, code);
    if (productRequest) {
      throw new ConflictException('이미 등록 요청된 상품입니다.');
    }
    const wholesalerProduct = await this.wholesalerProductsService.findOneWholesalerProductByCode(wholesalerId, code);
    if (wholesalerProduct) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }

    await this.productRequestsService.createProductRequest(sellerId, createProductRequestDto);
    return {
      statusCode: 201,
      message: '상품 등록 요청이 완료되었습니다.'
    };
  }
  
  @Get('product-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllProductRequestBySellerId(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.productRequestsService.findAllProductRequestBySellerId(sellerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('product-request/:productRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 조회' })
  @ApiResponse({ status: 200 })
  async findOneProductRequest(
    @Param('productRequestId') productReguestId: number
  ) {
    const result = await this.productRequestsService.findOneProductRequest(productReguestId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('product-request/:productRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 수정' })
  @ApiResponse({ status: 200 })
  async updateProductRequest(
    @Param('productRequestId') productRequestId: number, 
    @Body() updateProductRequestDto: UpdateProductRequestDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.productRequestsService.updateProductRequest(sellerId, productRequestId, updateProductRequestDto);
    return {
      statusCode: 200,
      message: '등록 요청 상품 수정이 완료되었습니다.'
    };
  }

  @Delete('product-requests')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 삭제' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'integer' },
          example: [1, 2],
        },
      },
    },
  })
  async deleteProductRequests(
    @Body() deleteProductRequestDto: DeleteProductRequestDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.productRequestsService.deleteProductRequests(sellerId, deleteProductRequestDto.ids);
    return {
      statusCode: 200,
      message: '등록 요청 상품 삭제가 완료되었습니다.'
    };
  }
}
