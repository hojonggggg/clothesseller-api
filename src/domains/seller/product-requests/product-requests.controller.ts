import { Body, ConflictException, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequest } from 'src/commons/shared/entities/product-request.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 등록 요청 상품 조회' })
  @ApiResponse({ status: 200 })
  async findOneProductRequestByProductReguestId(
    @Param('id') productReguestId: number, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.productRequestsService.findOneProductRequestByProductReguestId(sellerId, productReguestId);
    return {
      statusCode: 200,
      data: result
    };
  }
}
