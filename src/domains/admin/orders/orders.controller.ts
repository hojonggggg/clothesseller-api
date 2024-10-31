import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/commons/shared/orders/orders.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > orders')
@Controller('orders')
export class AdminOrdersController {
  constructor(
    private ordersService: OrdersService
  ) {}
  
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 주문 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  @ApiQuery({ name: 'query', required: false, description: '(도매처명 or 셀러명) or 상품명' })
  async findAllProduct(
    @Query('type') type: string,
    @Query('query') query: string, 
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.ordersService.findAllWholesalerOrderForAdmin(query, paginationQueryDto);
    } else if (type === 'SELLER') {
      //result = await this.sellerProductsService.findAllSellerProductByAdmin(query, paginationQuery);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }

}
