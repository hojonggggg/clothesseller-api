import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerOrdersService } from './orders.service';
import { SellerOrder } from 'src/commons/shared/entities/seller-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > orders')
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(
    private sellerOrdersService: SellerOrdersService
  ) {}

  @Get('received')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 쇼핑몰에서 들어온 주문 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllSellerOrderBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //return await this.sellerOrdersService.findAllSellerOrderBySellerId(sellerrId, query, paginationQuery);
    const result = await this.sellerOrdersService.findAllSellerOrderBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('auto-ordering')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 자동 발주 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllAutoWholesalerOrderBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const orderType = '자동';
    const result = await this.sellerOrdersService.findAllWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('manual-ordering')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 수동 발주 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllManualWholesalerOrderBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const orderType = '수동';
    const result = await this.sellerOrdersService.findAllWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('pre-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 미송 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllPrePaymentOfWholesalerOrderBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //const result = await this.sellerOrdersService.findAllPrePaymentOfWholesalerOrderBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      //data: result
    };
  }
}
