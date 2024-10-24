import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerSetOrderDto } from './dto/wholesaler-set-order.dto';
import { WholesalerCreatePrepaymentDto } from './dto/wholesaler-create-prepayment.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > orders')
@Controller('wholesaler')
export class WholesalerOrdersController {
  constructor(
    private wholesalerOrdersService: WholesalerOrdersService
  ) {}

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[status 확인] 주문 목록 조회' })
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

  @Patch('orders/soldout')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 품절' })
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
  async setSoldoutOrder(
    @Request() req, 
    @Body() wholesalerSetOrderDto: WholesalerSetOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.setSoldoutOrder(wholesalerId, wholesalerSetOrderDto.ids);
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
    const sellerId = req.user.uid;
    const result = await this.wholesalerOrdersService.createPrePayment(sellerId, wholesalerCreatePrepaymentDto);
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
        ids: {
          type: 'array',
          items: { type: 'integer' },
          example: [1, 2],
        },
      },
    },
  })
  async setDeliveryDelayOrder(
    @Request() req, 
    @Body() wholesalerSetOrderDto: WholesalerSetOrderDto
  ) {
    const wholesalerId = req.user.uid;
    const status = '출고지연';
    await this.wholesalerOrdersService.setDeliveryStatusOrder(wholesalerId, status, wholesalerSetOrderDto.ids);
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
