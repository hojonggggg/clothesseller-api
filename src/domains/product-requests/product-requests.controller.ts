import { Body, ConflictException, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
//import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from 'src/commons/shared/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { ProductRequest } from './entities/product-request.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('product-requests')
@Controller('product-requests')
export class ProductRequestsController {
  constructor(
    private readonly productRequestsService: ProductRequestsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[셀러] 상품 등록 요청' })
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
  @ApiOperation({ summary: '[관리자 | 도매처 | 셀러] 등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [ProductRequest] })
  async findSellerRegisterProducts(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const { uid, role } = req.user;
    if (role === 'WHOLESALER') {
      const wholesalerId = uid;
      return this.productRequestsService.findAllProductRequestByWholesalerId(wholesalerId, paginationQuery);
    } else if (role === 'SELLER') {
      const sellerId = uid;
      return this.productRequestsService.findAllProductRequestBySellerId(sellerId, paginationQuery);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[도매처 | 관리자] 등록 요청 상품 승인' })
  @ApiResponse({ status: 200, type: [ProductRequest] })
  async updateProductRequestStatus(
    @Param('id') productRequestId: number, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    console.log({wholesalerId});
    return this.productRequestsService.updateProductRequestStatus(wholesalerId, productRequestId);
  }
}
