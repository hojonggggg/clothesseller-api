import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerReturnsService } from './returns.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > returns')
@Controller('wholesaler')
export class WholesalerReturnsController {
  constructor(
    private wholesalerReturnsService: WholesalerReturnsService
  ) {}
  
  @Get('returns')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 반품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '상품명 or 셀러명' })
  async findAllReturn(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerReturnsService.findAllReturn(wholesalerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
}
