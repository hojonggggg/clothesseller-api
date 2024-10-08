import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequest } from 'src/commons/shared/entities/product-requests.entity';
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
  @ApiOperation({ summary: '상품 등록 요청' })
  @ApiResponse({ status: 201, type: ProductRequest })
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
    return this.productRequestsService.createProductRequest(sellerId, createProductRequestDto);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [ProductRequest] })
  async findSellerRegisterProducts(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    return this.productRequestsService.findAllProductRequestBySellerId(sellerId, paginationQuery);
  }
}
