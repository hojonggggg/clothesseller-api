import { Body, ConflictException, Controller, ForbiddenException, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerProductsService } from './wholesalerProducts.service';
import { SellerRegisterProduct } from 'src/domains/seller/products/entities/seller-register-product.entity';
import { UpdateSellerRegisterProductDto } from './dto/_update-seller-register-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > products')
@Controller('wholesaler')
export class WholesalerProductsController {
  constructor(
    private readonly wholesalerProductsService: WholesalerProductsService
  ) {}
  /*
  @Get('register-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '등록 요청 상품 목록 조회' })
  @ApiResponse({ status: 200, type: [SellerRegisterProduct] })
  async findSellerRegisterProducts(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    return this.wholesalerProductsService.findSellerRegisterProductsByWholesalerId(wholesalerId, paginationQuery);
  }
  */
  @Patch('register-product/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '등록 요청 상품 승인' })
  @ApiResponse({ status: 200, type: [SellerRegisterProduct] })
  async updateSellerRegisterProductStatus(
    @Param('id') registerProductId: number, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    return this.wholesalerProductsService.updateSellerRegisterProductStatus(wholesalerId, registerProductId);
  }
  

}
