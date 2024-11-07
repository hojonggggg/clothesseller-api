import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > orders')
@Controller('admin')
export class AdminOrdersController {
  constructor(
    private ordersService: OrdersService
  ) {}
  
  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 주문 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  @ApiQuery({ name: 'query', required: false, description: '(도매처명 or 셀러명) or 상품명' })
  async findAllOrder(
    @Query('type') type: string,
    @Query('query') query: string, 
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.ordersService.findAllWholesalerOrderForAdmin(query, paginationQueryDto);
    } else if (type === 'SELLER') {
      result = await this.ordersService.findAllSellerOrderForAdmin(query, paginationQueryDto);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 주문 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  async findOneOrder(
    @Param('orderId') orderId: number, 
    @Query('type') type: string
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.ordersService.findOneWholesalerOrderForAdmin(orderId);
    } else if (type === 'SELLER') {
      result = await this.ordersService.findOneSellerOrderForAdmin(orderId);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('orders/statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 상품별 주문 통계' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'startDate', required: true, description: '조회 시작 날짜' })
  @ApiQuery({ name: 'endDate', required: true, description: '조회 끝 날짜' })
  @ApiQuery({ name: 'query', required: false, description: '상품명' })
  async wholesalerOrderStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const result = await this.ordersService.wholesalerOrderVolume(startDate, endDate, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
}
