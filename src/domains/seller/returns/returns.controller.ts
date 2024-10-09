import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '[검색 추가 필요] 반품 목록 조회' })
  @ApiResponse({ status: 200, type: [Return] })
  async findAllReturnBySellerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    return await this.sellerReturnsService.findAllReturnBySellerId(sellerrId, paginationQuery);
  }
}
