import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerProductsService } from './products.service';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDto } from './dto/create-wholesaler-product.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > products')
@Controller('wholesaler/products')
export class WholesalerProductsController {
  constructor(
    private wholesalerProductsService: WholesalerProductsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '상품 등록' })
  @ApiResponse({ status: 201, type: WholesalerProduct })
  async createWholesalerProduct(
    @Body() createWholesalerProductDto: CreateWholesalerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    const { code } = createWholesalerProductDto;
    const product = await this.wholesalerProductsService.findOneWholesalerProductByWholesalerIdAndCode(wholesalerId, code);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    return await this.wholesalerProductsService.createWholesalerProduct(wholesalerId, createWholesalerProductDto);
  }

  @Post('options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[후순위] 상품 옵션 등록' })
  @ApiResponse({ status: 201, type: WholesalerProductOption })
  async createWholesalerProductOption(
    @Body() createWholesalerProductDto: CreateWholesalerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    const { code } = createWholesalerProductDto;
    const product = await this.wholesalerProductsService.findOneWholesalerProductByWholesalerIdAndCode(wholesalerId, code);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    return await this.wholesalerProductsService.createWholesalerProduct(wholesalerId, createWholesalerProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiResponse({ status: 200, type: [WholesalerProduct] })
  async findAllWholesalerProductByWholesalerId(
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    return await this.wholesalerProductsService.findAllWholesalerProductByWholesalerId(wholesalerId, paginationQuery);
  }
}
