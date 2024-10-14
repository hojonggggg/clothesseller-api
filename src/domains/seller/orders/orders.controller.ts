import { Body, Controller, Get, Delete, Query, Request, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerOrdersService } from './orders.service';
import { DeleteSellerOrderDto } from './dto/delete-seller-order.dto';
import { DeleteWholesalerOrderDto } from './dto/delete-wholesaler-order.dto';
import { PrepaymentWholesalerOrderDto } from './dto/prepayment-wholesaler-order.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > orders')
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(
    private sellerOrdersService: SellerOrdersService
  ) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 주문 현황' })
  @ApiResponse({ status: 200 })
  async summarySellerProduct(
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.sellerOrdersService.summarySellerOrder(sellerId);
    return {
      statusCode: 200,
      data: result
    };
  }


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

  @Delete('received/delete')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 쇼핑몰에서 들어온 주문 내역 삭제' })
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
  async deleteSellerOrder(
    @Body() deleteSellerOrderDto: DeleteSellerOrderDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerOrdersService.deleteSellerOrder(sellerId, deleteSellerOrderDto.ids);
    return {
      statusCode: 200,
      message: '주문 내역 삭제가 완료되었습니다.'
    };
  }

  @Get('ordering-wait')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 도매처로 주문하기 전 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllSellerOrderWaitBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //return await this.sellerOrdersService.findAllSellerOrderBySellerId(sellerrId, query, paginationQuery);
    const result = await this.sellerOrdersService.findAllSellerOrderWaitBySellerId(sellerrId, query, paginationQuery);
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

  @Delete('ordering/delete')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 자동 발주 내역 삭제' })
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
  async deleteWholesalerOrder(
    @Body() deleteWholesalerOrderDto: DeleteWholesalerOrderDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerOrdersService.deleteWholesalerOrder(sellerId, deleteWholesalerOrderDto.ids);
    return {
      statusCode: 200,
      message: '주문 내역 삭제가 완료되었습니다.'
    };
  }

  @Patch('ordering/pre-payment')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 처리' })
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
  async prepaymentWholesalerOrder(
    @Body() prepaymentWholesalerOrderDto: PrepaymentWholesalerOrderDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerOrdersService.prepaymentWholesalerOrder(sellerId, prepaymentWholesalerOrderDto.ids);
    return {
      statusCode: 200,
      message: '미송 처리가 완료되었습니다.'
    };
  }

  @Get('pre-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명 or 날짜' })
  async findAllPrePaymentOfWholesalerOrderBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerOrdersService.findAllPrePaymentOfWholesalerOrderBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('pre-payment/monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 월간 미송 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회하려는 달' })
  async findAllPrePaymentOfMonthlyBySellerId(
    @Query('month') month: string,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerOrdersService.findAllPrePaymentOfMonthlyBySellerId(sellerrId, month);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('pre-payment/daily')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 일간 미송 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'day', required: true, description: '조회하려는 날' })
  async findAllPrePaymentOfDailyBySellerId(
    @Query('day') day: string,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerOrdersService.findAllPrePaymentOfDailyBySellerId(sellerrId, day);
    return {
      statusCode: 200,
      data: result
    };
  }
}
