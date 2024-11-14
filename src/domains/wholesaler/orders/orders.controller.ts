import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerConfirmOrderDto } from './dto/wholesaler-confirm-order.dto';
import { WholesalerPrepaymentOrderDto } from './dto/wholesaler-prepayment-order.dto';
import { WholesalerDeliveryDelayOrderDto } from './dto/wholesaler-delivery-delay-order.dto';
import { WholesalerRejectOrderDto } from './dto/wholesaler-reject-order.dto';
import { WholesalerSoldoutOrderDto } from './dto/wholesaler-soldout-order.dto';
import { WholesalerSetOrderDto } from './dto/wholesaler-set-order.dto';
import { WholesalerCreatePrepaymentDto } from './dto/wholesaler-create-prepayment.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > orders')
@Controller('wholesaler')
export class WholesalerOrdersController {
  constructor(
    private ordersService: OrdersService,
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
    const wholesalerId = req.user.uid;
    //const result = await this.sellerOrdersService.summarySellerOrder(sellerId);
    const result = await this.ordersService.wholesalerOrderSummary(wholesalerId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 주문 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'date', required: true, description: '조회일자(yyyy/mm/dd)' })
  @ApiQuery({ name: 'query', required: false, description: '상품명 or 셀러명' })
  async findAllOrder(
    @Request() req,
    @Query('date') date: string,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerOrdersService.findAllOrder(wholesalerId, date, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('orders/confirm')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 발주확인' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: { 
            type: 'object', 
            properties: {
              id: { type: 'integer', example: 1 },
              quantity: { type: 'integer', example: 10 },
            },
          },
          example: [
            { id: 1, quantity: 10 },
            { id: 2, quantity: 20 }
          ],
        },
      },
    },
  })
  async orderConfirm(
    @Request() req, 
    @Body() wholesalerConfirmOrderDto: WholesalerConfirmOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.orderConfirm(wholesalerId, wholesalerConfirmOrderDto);
    return {
      statusCode: 200,
      message: '발주 확인되었습니다.'
    };
  }

  @Patch('orders/pre-payment')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 미송' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: { 
            type: 'object', 
            properties: {
              id: { type: 'integer', example: 1 },
              quantity: { type: 'integer', example: 10 },
              prepaymentDate: { type: 'string', example: '2024/10/10' },
              deliveryDate: { type: 'string', example: '2024/10/15' },
            },
          },
          example: [
            { id: 1, quantity: 10, prepaymentDate: '2024/10/10', deliveryDate: '2024/10/15' },
            { id: 2, quantity: 20, prepaymentDate: '2024/10/20', deliveryDate: '2024/10/25' }
          ],
        },
      },
    },
  })
  async orderPrepayment(
    @Request() req, 
    @Body() wholesalerPrepaymentOrderDto: WholesalerPrepaymentOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.orderPrepayment(wholesalerId, wholesalerPrepaymentOrderDto);
    return {
      statusCode: 200,
      message: '미송 처리되었습니다.'
    };
  }

  @Patch('orders/reject')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 발주불가' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: { 
            type: 'object', 
            properties: {
              id: { type: 'integer', example: 1 },
              quantity: { type: 'integer', example: 10 },
              memo: { type: 'string', example: '2024/10/20 발송예정' },
            },
          },
          example: [
            { id: 1, quantity: 10, memo: '2024/10/20 발송예정' },
            { id: 2, quantity: 20, memo: '2024/10/30 발송예정' }
          ],
        },
      },
    },
  })
  async orderReject(
    @Request() req, 
    @Body() wholesalerRejectOrderDto: WholesalerRejectOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.orderReject(wholesalerId, wholesalerRejectOrderDto);
    return {
      statusCode: 200,
      message: '발주 불가되었습니다.'
    };
  }

  @Patch('orders/soldout')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 품절' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: { 
            type: 'object', 
            properties: {
              id: { type: 'integer', example: 1 },
              memo: { type: 'string', example: '2024/10/20 발송예정' },
            },
          },
          example: [
            { id: 1, memo: '2024/10/20 발송예정' },
            { id: 2, memo: '2024/10/30 발송예정' }
          ],
        },
      },
    },
  })
  async orderSoldout(
    @Request() req, 
    @Body() wholesalerSoldoutOrderDto: WholesalerSoldoutOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.orderSoldout(wholesalerId, wholesalerSoldoutOrderDto);
    return {
      statusCode: 200,
      message: '품절 처리가 완료되었습니다.'
    };
  }

  @Post('order/pre-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 등록' })
  @ApiResponse({ status: 201 })
  async createPrePayment(
    @Body() wholesalerCreatePrepaymentDto: WholesalerCreatePrepaymentDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerOrdersService.createPrePaymentFromWholesaler(wholesalerId, wholesalerCreatePrepaymentDto);
    return {
      statusCode: 201,
      message: '미송 등록이 완료되었습니다.'
    };
  }


  @Get('orders/pre-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '상품명 or 셀러명' })
  async findAllPrePayment(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerOrdersService.findAllPrePayment(wholesalerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('orders/pre-payment/delivery-complete')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 출고완료' })
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
  async setDeliveryCompleteOrder(
    @Request() req, 
    @Body() wholesalerSetOrderDto: WholesalerSetOrderDto
  ) {
    const wholesalerId = req.user.uid;
    const status = '출고완료';
    await this.wholesalerOrdersService.setDeliveryStatusOrder(wholesalerId, status, wholesalerSetOrderDto.ids);
    return {
      statusCode: 200,
      message: '출고완료 처리되었습니다.'
    };
  }

  @Patch('orders/pre-payment/delivery-delay')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 출고지연' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: { 
            type: 'object', 
            properties: {
              id: { type: 'integer', example: 1 },
              quantity: { type: 'integer', example: 10 },
              deliveryDate: { type: 'string', example: '2024/10/15' },
            },
          },
          example: [
            { id: 1, quantity: 10, deliveryDate: '2024/10/15' },
            { id: 2, quantity: 20, deliveryDate: '2024/10/25' }
          ],
        },
      },
    },
  })
  async setDeliveryDelayOrder(
    @Request() req, 
    @Body() wholesalerDeliveryDelayOrderDto: WholesalerDeliveryDelayOrderDto
  ) {
    const wholesalerId = req.user.uid;
    const status = '출고지연';
    await this.wholesalerOrdersService.setDeliveryDelayOrder(wholesalerId, wholesalerDeliveryDelayOrderDto);
    return {
      statusCode: 200,
      message: '출고지연 처리되었습니다.'
    };
  }

  @Get('orders/pre-payment/monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 월간 미송 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회하려는 달' })
  async findAllPrePaymentOfMonthly(
    @Request() req,
    @Query('month') month: string
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerOrdersService.findAllPrePaymentOfMonthly(wholesalerId, month);
    return {
      statusCode: 200,
      data: result
    };
  }
}