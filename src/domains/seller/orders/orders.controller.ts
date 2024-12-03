import { Body, Controller, Get, Delete, Query, Request, UseGuards, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { SellerOrdersService } from './orders.service';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { DeleteSellerOrderDto } from './dto/delete-seller-order.dto';
import { DeleteWholesalerOrderDto } from './dto/delete-wholesaler-order.dto';
//import { CreateManualOrderingDto } from './dto/create-manual-ordering.dto';
import { CreateManualOrderDto } from 'src/commons/shared/orders/dto/create-manual-order.dto';
import { CreatePrepaymentDto } from './dto/create-prepayment.dto';
//import { PrepaymentWholesalerOrderDto } from './dto/prepayment-wholesaler-order.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > orders')
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(
    private ordersService: OrdersService,
    private sellerOrdersService: SellerOrdersService,
    private wholesalerOrdersService: WholesalerOrdersService
  ) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 현황' })
  @ApiResponse({ status: 200 })
  async summarySellerProduct(
    @Request() req
  ) {
    const sellerId = req.user.uid;
    //const result = await this.sellerOrdersService.summarySellerOrder(sellerId);
    const result = await this.ordersService.sellerOrderSummary(sellerId);
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
    //const result = await this.sellerOrdersService.findAllSellerOrderBySellerId(sellerrId, query, paginationQuery);
    const result = await this.ordersService.findAllSellerOrderBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Delete('received/delete')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 쇼핑몰에서 들어온 주문 내역 삭제' })
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
    //await this.sellerOrdersService.deleteSellerOrder(sellerId, deleteSellerOrderDto.ids);
    await this.ordersService.deleteSellerOrder(sellerId, deleteSellerOrderDto.ids);
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
    const result = await this.ordersService.findAllSellerOrderWaitBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }
  /*
  @Get('ordering')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '발주 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'orderType', required: true, description: 'AUTO OR MANUAL' })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllWholesalerOrderBySellerId(
    @Query('orderType') orderType: string,
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    let result;
    if (orderType === "AUTO") {
      result = await this.sellerOrdersService.findAllAutoWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
    } else if (orderType === "MANUAL") {
      result = await this.sellerOrdersService.findAllManualWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
    }
    return {
      statusCode: 200,
      data: result
    };
  }
  */
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
    const orderType = 'AUTO';
    const result = await this.sellerOrdersService.findAllAutoWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
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
    const orderType = 'MANUAL';
    const result = await this.ordersService.findAllManualWholesalerOrderBySellerId(sellerrId, orderType, query, paginationQuery);
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

  @Post('manual-ordering')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 수동 발주 요청' })
  @ApiResponse({ status: 201 })
  async createManualOrdering(
    //@Body() createManualOrderingDto: CreateManualOrderingDto, 
    @Body() createManualOrderDto: CreateManualOrderDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    for (const order of createManualOrderDto.orders) {
      order.orderNo = '발주';
    }
    await this.ordersService.createManualOrder(sellerId, createManualOrderDto);
    return {
      statusCode: 201,
      message: '수동 발주 요청이 완료되었습니다.'
    };
  }

  @Get('orderings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '발주 현황 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'date', required: false, description: '검색할 날짜' })
  async findSellerOrderingsBySellerId(
    @Query('date') date: string,
    @Query() paginationQueryDto: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.ordersService.findSellerOrderingsBySellerId(sellerrId, date, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('ordering-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '발주 현황 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'date', required: false, description: '검색할 날짜' })
  async findSellerOrderingProgressBySellerId(
    @Query('date') date: string,
    @Query() paginationQueryDto: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.ordersService.sellerOrderingProgressBySellerId(sellerrId, date, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Post('pre-payment')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 요청' })
  @ApiResponse({ status: 201 })
  async createPrepayment(
    //@Body() createPrepaymentDto: CreatePrepaymentDto, 
    @Body() createManualOrderDto: CreateManualOrderDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    //await this.wholesalerOrdersService.createPrepayment(sellerId, createPrepaymentDto);
    //createManualOrderDto.orderNo = '미송';
    //createManualOrderDto.status = '미송요청';
    for (const order of createManualOrderDto.orders) {
      order.orderNo = '미송';
      order.status = '미송대기';
    }
    await this.ordersService.createManualOrder(sellerId, createManualOrderDto);
    return {
      statusCode: 201,
      message: '미송 요청이 완료되었습니다.'
    };
  }

  @Get('pre-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 내역 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명 or 날짜' })
  async findAllPrePaymentOfWholesalerOrderBySellerId(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerOrdersService.findAllPrePaymentOfWholesalerOrderBySellerId(sellerrId, startDate, endDate, query, paginationQuery);
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
