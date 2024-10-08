import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerOrdersService } from './orders.service';
import { WholesalerOrder } from 'src/commons/shared/entities/wholesaler-order.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > orders')
@Controller('wholesaler/orders')
export class WholesalerOrdersController {
  constructor(
    private wholesalerOrdersService: WholesalerOrdersService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[검색 추가 필요] 주문 목록 조회' })
  @ApiResponse({ status: 200, type: [WholesalerOrder] })
  @ApiQuery({ name: 'date', required: true, description: '조회일자(yyyy-mm-dd)' })
  async findAllOrderByWholesalerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('date') date: string,
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    return await this.wholesalerOrdersService.findAllOrderByWholesalerId(wholesalerId, date, paginationQuery);
  }
}
