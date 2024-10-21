import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerSamplesService } from './samples.service';
import { SellerCreateSampleDto } from './dto/seller-create-sample.dto';
import { SellerDeleteSampleDto } from './dto/seller-delete-sample.dto';
import { SellerReturnSampleDto } from './dto/seller-return-sample.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > samples')
@Controller('seller/samples')
export class SellerSamplesController {
  constructor(
    private sellerSamplesService: SellerSamplesService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 등록' })
  //@ApiResponse({ status: 201, type: Sample, isArray: true })
  @ApiResponse({ status: 201 })
  async createSample(
    @Body() sellerCreateSampleDto: SellerCreateSampleDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    //return await this.sellerSamplesService.createSample(sellerId, sellerCreateSampleDto);
    const result = await this.sellerSamplesService.createSample(sellerId, sellerCreateSampleDto);
    return {
      statusCode: 201,
      message: '샘플 등록이 완료되었습니다.'
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명 or 날짜' })
  async findAllSampleBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerSamplesService.findAllSampleBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('delete')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 삭제' })
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
  async deleteSample(
    @Body() sellerDeleteSampleDto: SellerDeleteSampleDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerSamplesService.deleteSample(sellerId, sellerDeleteSampleDto.ids);
    return {
      statusCode: 200,
      message: '샘플 삭제가 완료되었습니다.'
    };
  }

  @Patch('return')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 반납' })
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
  async returnSample(
    @Body() sellerReturnSampleDto: SellerReturnSampleDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.sellerSamplesService.returnSample(sellerId, sellerReturnSampleDto.ids);
    return {
      statusCode: 200,
      message: '샘플 반납 신청이 완료되었습니다.'
    };
  }

  @Get('monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 월간 샘플 반납 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회하려는 달' })
  async findAllSampleOfMonthlyBySellerId(
    @Query('month') month: string,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerSamplesService.findAllSampleOfMonthlyBySellerId(sellerrId, month);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('daily')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 일간 샘플 반납 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'day', required: true, description: '조회하려는 날' })
  async findAllSampleOfDailyBySellerId(
    @Query('day') day: string,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    const result = await this.sellerSamplesService.findAllSampleOfDailyBySellerId(sellerrId, day);
    return {
      statusCode: 200,
      data: result
    };
  }
}
