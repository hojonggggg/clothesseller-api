import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductsService } from 'src/commons/shared/products/products.service';
import { WholesalerProductsService } from './products.service';
import { WholesalerProduct } from './entities/wholesaler-product.entity';
import { WholesalerProductOption } from './entities/wholesaler-product-option.entity';
import { CreateWholesalerProductDto } from './dto/create-wholesaler-product.dto';
import { UpdateWholesalerProductDto } from './dto/update-wholesaler-product.dto';
import { DeleteWholesalerProductOptionDto } from './dto/delete-wholesaler-product-option.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > products')
@Controller('wholesaler')
export class WholesalerProductsController {
  constructor(
    private productsService: ProductsService,
    private wholesalerProductsService: WholesalerProductsService
  ) {}

  @Post('product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 등록' })
  @ApiResponse({ status: 201 })
  async createWholesalerProduct(
    @Body() createWholesalerProductDto: CreateWholesalerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    const { name } = createWholesalerProductDto;
    const product = await this.wholesalerProductsService.findOneWholesalerProductByName(wholesalerId, name);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    await this.wholesalerProductsService.createWholesalerProduct(wholesalerId, createWholesalerProductDto);
    return {
      statusCode: 201,
      message: '상품 등록이 완료되었습니다.'
    };
  }
  
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllWholesalerProduct(
    @Query('query') query: string,
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    //const result = await this.wholesalerProductsService.findAllWholesalerProductWithPagination(wholesalerId, query, paginationQuery);
    //const result = await this.wholesalerProductsService.findAllWholesalerProduct(wholesalerId, query);
    const result = await this.productsService.findAllWholesalerProduct(wholesalerId, query);
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('products/pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상품 옵션 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllWholesalerProductOptionWithPagination(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    //const result = await this.wholesalerProductsService.findAllWholesalerProductWithPagination(wholesalerId, query, paginationQuery);
    const result = await this.wholesalerProductsService.findAllWholesalerProductOptionWithPagination(wholesalerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('product/:wholesalerProductId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 도매처 상품 조회' })
  @ApiResponse({ status: 200 })
  async findOneWholesalerProduct(
    @Param('wholesalerProductId') wholesalerProductId: number, 
    //@Request() req
  ) {
    const result = await this.wholesalerProductsService.findOneWholesalerProduct(wholesalerProductId);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('product/:wholesalerProductId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 도매처 상품 수정' })
  @ApiResponse({ status: 200 })
  async updateWholesalerProduct(
    @Param('wholesalerProductId') wholesalerProductId: number, 
    @Body() updateWholesalerProductDto: UpdateWholesalerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerProductsService.updateWholesalerProduct(wholesalerId, wholesalerProductId, updateWholesalerProductDto);
    return {
      statusCode: 200,
      message: '상품 수정이 완료되었습니다.'
    };
  }

  @Delete('products')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 상품 옵션 삭제' })
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
  async deleteWholesalerProducts(
    @Request() req,
    @Body() deleteWholesalerProductOptionDto: DeleteWholesalerProductOptionDto, 
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerProductsService.deleteWholesalerProducts(wholesalerId, deleteWholesalerProductOptionDto.ids);
    return {
      statusCode: 200,
      message: '상품 옵션 삭제가 완료되었습니다.'
    };
  }
  /*
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
  */
  
}
