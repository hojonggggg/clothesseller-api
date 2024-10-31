import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerProductsService } from 'src/domains/wholesaler/products/products.service';
import { SellerProductsService } from 'src/domains/seller/products/products.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > products')
@Controller('admin')
export class AdminProductsController {
  constructor(
    private wholesalerProductsService: WholesalerProductsService,
    private sellerProductsService: SellerProductsService
  ) {}
  
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 목록 조회' })
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
      result = await this.wholesalerProductsService.findAllWholesalerProductForAdmin(query, paginationQueryDto);
    } else if (type === 'SELLER') {
      result = await this.sellerProductsService.findAllSellerProductForAdmin(query, paginationQueryDto);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('product/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  async findOneWholesalerProduct(
    @Param('productId') productId: number, 
    @Query('type') type: string
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.wholesalerProductsService.findOneWholesalerProductByWholesalerProductId(productId);
    } else if (type === 'SELLER') {
      result = await this.sellerProductsService.findOneSellerProductBySellerProductId(productId);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }

}
