import { Body, ConflictException, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { DeliverymanService } from './deliveryman.service';
import { Deliveryman } from './entities/deliveryman.entity';
import { SellerProductsService } from '../products/products.service';
import { Mall } from '../malls/entities/mall.entity';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > deliveryman')
@Controller('seller/deliveryman')
export class DeliverymanController {
  constructor(
    private readonly deliverymanService: DeliverymanService,
    private readonly sellerProductsService: SellerProductsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 사입삼촌 등록' })
  @ApiResponse({ status: 201 })
  async createDeliveryman(
    @Body() createDeliverymanDto: CreateDeliverymanDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { mobile } = createDeliverymanDto;
    console.log({sellerId, mobile});
    const deliveryman = await this.deliverymanService.findOneDeliverymanBySellerIdAndMobile(sellerId, mobile);
    if (deliveryman) {
      throw new ConflictException('이미 등록된 사입삼촌입니다.');
    }
    //return await this.deliverymanService.createDeliveryman(sellerId, createDeliverymanDto);
    const result = await this.deliverymanService.createDeliveryman(sellerId, createDeliverymanDto);
    return {
      statusCode: 201,
      message: '사입삼촌 등록이 완료되었습니다.'
    };
  }

  @Get('stores')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 상가 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상가명' })
  async findAllStoresBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    //return await this.sellerProductsService.findAllStoresOfProductBySellerId(sellerId, storeName, paginationQuery);
    const result = await this.sellerProductsService.findAllStoresOfProductBySellerId(sellerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

}
