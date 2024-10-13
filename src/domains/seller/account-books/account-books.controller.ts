import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerAccountBooksService } from './account-books.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > account-books')
@Controller('seller/account-books')
export class SellerAccountBooksController {
  constructor(
    private sellerAccountBooksService: SellerAccountBooksService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 장부 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회 월' })
  @ApiQuery({ name: 'wholesalerName', required: false, description: '도매처명' })
  async findAllAccountBookBySellerId(
    @Query('month') month: string,
    @Query('wholesalerName') wholesalerName: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //return await this.sellerSamplesService.findAllSampleBySellerId(sellerrId, productName, wholesalerName, paginationQuery);
    const result = await this.sellerAccountBooksService.findAllAccountBookBySellerId(sellerrId, month, wholesalerName, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

}
