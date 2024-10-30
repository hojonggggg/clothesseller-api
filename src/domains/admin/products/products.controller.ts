import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';

@ApiTags('admin > products')
@Controller('admin')
export class AdminProductsController {
  constructor(
    private wholesalerProductsService: WholesalerProductsService
  ) {}
  
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '도매처명 or 상품명' })
  async findAllWholesalerProduct(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const result = await this.wholesalerProductsService.findAllWholesalerProductByAdmin(query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }



}
