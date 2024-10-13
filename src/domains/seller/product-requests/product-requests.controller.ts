import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { DeleteProductRequestDto } from './dto/delete-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > product-requests')
@Controller('seller/product-requests')
export class ProductRequestsController {
  constructor(
    private readonly productRequestsService: ProductRequestsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청' })
  //@ApiResponse({ status: 201, type: ProductRequest })
  @ApiResponse({ status: 201 })
  async createProductRequest(
    @Body() createProductRequestDto: CreateProductRequestDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { productCode } = createProductRequestDto;
    const productRequest = await this.productRequestsService.findOneProductRequestBySellerIdAndProductCode(sellerId, productCode);
    if (productRequest) {
      throw new ConflictException('이미 등록 요청된 상품입니다.');
    }
    //return this.productRequestsService.createProductRequest(sellerId, createProductRequestDto);
    await this.productRequestsService.createProductRequest(sellerId, createProductRequestDto);
    return {
      statusCode: 201,
      message: '상품 등록 요청이 완료되었습니다.'
    };
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllProductRequestBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.productRequestsService.findAllProductRequestBySellerId(sellerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get(':productRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 조회' })
  @ApiResponse({ status: 200 })
  async findOneProductRequestByProductReguestId(
    @Param('productRequestId') productReguestId: number, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.productRequestsService.findOneProductRequestByProductRequestId(sellerId, productReguestId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch(':productRequestId')
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
    const result = await this.productRequestsService.updateProductRequest(sellerId, productRequestId, updateProductRequestDto);
    return {
      statusCode: 200,
      message: '등록 요청 상품 수정이 완료되었습니다.'
    };
  }

  @Delete()  
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
  async deleteSellerProduct(
    @Body() deleteProductRequestDto: DeleteProductRequestDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.productRequestsService.deleteProductRequest(sellerId, deleteProductRequestDto.ids);
    return {
      statusCode: 200,
      message: '등록 요청 상품 삭제가 완료되었습니다.'
    };
  }
}
