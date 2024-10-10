import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SellerSamplesService } from './samples.service';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { SellerCreateSampleDto } from './dto/seller-create-sample.dto';
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
  async createSampleBySeller(
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
  @ApiQuery({ name: 'query', required: false, description: '검색할 상품명' })
  async findAllSampleBySellerId(
    @Query('query') query: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req
  ) {
    const sellerrId = req.user.uid;
    //return await this.sellerSamplesService.findAllSampleBySellerId(sellerrId, productName, wholesalerName, paginationQuery);
    const result = await this.sellerSamplesService.findAllSampleBySellerId(sellerrId, query, paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }
}
