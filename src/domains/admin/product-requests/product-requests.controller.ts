import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from 'src/commons/shared/product-requests/product-requests.service';
import { ApproveProductRequestDto } from 'src/commons/shared/product-requests/dto/approve-product-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > product-requests')
@Controller('admin')
export class AdminProductRequestsController {
  constructor(
    private productRequestsService: ProductRequestsService
  ) {}

  @Get('product-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록 요청 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '상품명' })
  async findAllProductRequest(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const result = await this.productRequestsService.findAllProductRequestForAdmin(query, paginationQueryDto);

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
    const adminId = req.user.uid;
    await this.productRequestsService.approveProductRequest(adminId, productRequestId, approveProductRequestDto);

    return {
      statusCode: 200,
      message: '상품 등록 요청 승인이 완료되었습니다.'
    };
  }

}
