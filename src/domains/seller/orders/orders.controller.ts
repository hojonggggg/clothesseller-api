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
  @ApiOperation({ summary: '[검색 추가 필요] 쇼핑몰에서 들어온 주문 내역 조회' })
  @ApiResponse({ status: 200, type: [SellerOrder] })
  async findAllSellerOrderBySellerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    return await this.sellerOrdersService.findAllSellerOrderBySellerId(sellerrId, paginationQuery);
  }

  @Get('auto-ordering')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[검색 추가 필요] 자동 발주 내역 조회' })
  @ApiResponse({ status: 200, type: [SellerOrder] })
  async findAllAutoWholesalerOrderBySellerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const orderType = '자동';
    return await this.sellerOrdersService.findAllWholesalerOrderBySellerId(sellerrId, orderType, paginationQuery);
  }

  @Get('manual-ordering')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[검색 추가 필요] 수동 발주 내역 조회' })
  @ApiResponse({ status: 200, type: [SellerOrder] })
  async findAllManualWholesalerOrderBySellerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const orderType = '수동';
    return await this.sellerOrdersService.findAllWholesalerOrderBySellerId(sellerrId, orderType, paginationQuery);
  }
}
