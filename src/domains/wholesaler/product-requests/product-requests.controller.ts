import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from 'src/commons/shared/product-requests/product-requests.service';
import { ApproveProductRequestDto } from 'src/commons/shared/product-requests/dto/approve-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > product-requests (상품 기준)')
@Controller('wholesaler')
export class ProductRequestsController {
  constructor(
    private productRequestsService: ProductRequestsService,
  ) {}

  @Get('product-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllProductRequestByWholesalerId(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.productRequestsService.findAllProductRequestForWholesaler(wholesalerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('product-request/:productRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청 조회' })
  @ApiResponse({ status: 200 })
  async findOneProductRequest(
    @Param('productRequestId') productRequestId: number
  ) {
    const result = await this.productRequestsService.findOneProductRequest(productRequestId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('product-request/:productRequestId/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청 승인' })
  @ApiResponse({ status: 200 })
  async approveProductRequest(
    @Request() req,
    @Param('productRequestId') productRequestId: number,
    @Body() approveProductRequestDto: ApproveProductRequestDto
  ) {
    const wholesalerId = req.user.uid;
    await this.productRequestsService.approveProductRequest(wholesalerId, productRequestId, approveProductRequestDto);
    return {
      statusCode: 200,
      message: '상품 등록 요청이 완료되었습니다.'
    };
  }

}
