import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerOrdersService } from './orders.service';
import { SoldoutWholesalerOrderDto } from './dto/soldout-wholesaler-order.dto';
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
  @ApiOperation({ summary: '[개발] 품절 처리' })
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
  async soldoutOrder(
    @Request() req, 
    @Body() soldoutWholesalerOrderDto: SoldoutWholesalerOrderDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerOrdersService.soldoutOrder(wholesalerId, soldoutWholesalerOrderDto.ids);
    return {
      statusCode: 200,
      message: '품절 처리가 완료되었습니다.'
    };
  }
}
