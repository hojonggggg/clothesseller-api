import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerReturnsService } from './returns.service';
import { Return } from 'src/commons/shared/entities/return.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > returns')
@Controller('seller/returns')
export class SellerReturnsController {
  constructor(
    private sellerReturnsService: SellerReturnsService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 반품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllReturnBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //return await this.sellerReturnsService.findAllReturnBySellerId(sellerrId, productName, paginationQuery);
    const result = await this.sellerReturnsService.findAllReturnBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('credit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 전잔 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllReturnCreditBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerReturnsService.findAllReturnCreditBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }
}
