import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerSamplesService } from './samples.service';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > samples')
@Controller('seller/samples')
export class SellerSamplesController {
  constructor(
    private sellerSamplesService: SellerSamplesService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[검색 추가 필요] 샘플 목록 조회' })
  @ApiResponse({ status: 200, type: [Sample] })
  async findAllSampleBySellerId(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    return await this.sellerSamplesService.findAllSampleBySellerId(sellerrId, paginationQuery);
  }
}
