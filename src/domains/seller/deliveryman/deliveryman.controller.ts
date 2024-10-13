import { Body, ConflictException, Controller, Get, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { DeliverymanService } from './deliveryman.service';
import { Deliveryman } from './entities/deliveryman.entity';
import { SellerProductsService } from '../products/products.service';
import { WholesalerOrdersService } from 'src/domains/wholesaler/orders/orders.service';
import { SellerReturnsService } from '../returns/returns.service';
import { Mall } from '../malls/entities/mall.entity';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > deliveryman')
@Controller('seller/deliveryman')
export class DeliverymanController {
  constructor(
    private readonly deliverymanService: DeliverymanService,
    private readonly sellerProductsService: SellerProductsService,
    private readonly wholesalerOrdersService: WholesalerOrdersService,
    private readonly sellerReturnsService: SellerReturnsService
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
  @ApiOperation({ summary: '[완료] 거래 상가 목록 조회' })
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

  @Get('pickup/from-wholesaler')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 픽업 내역 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 도매처명' })
  async findAllPickupOfFromWholesalerBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.wholesalerOrdersService.findAllPickupOfFromWholesalerBySellerId(sellerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('pickup/from-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 반품 내역 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 도매처명' })
  async findAllPickupOfFromSellerBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.sellerReturnsService.findAllPickupOfFromSellerBySellerId(sellerId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

/*
  @Patch('pickup')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 픽업 요청' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
        },
      },
    },
  })
  async returnSample(
    @Body() createPickupRequestDtos: CreatePickupRequestDto[], 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerSamplesService.returnSample(sellerId, sellerReturnSampleDtos);
    return {
      statusCode: 200,
      message: '샘플 반납 신청이 완료되었습니다.'
    };
  }
*/
}
