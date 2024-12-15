import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSellerApiDto } from 'src/commons/shared/mall-api/dto/create-seller-api-dto';
import { MallApiService } from 'src/commons/shared/mall-api/mall-api.service';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';

@ApiTags('seller > mall-apis')
@Controller('seller/mall-apis')
export class MallApiController {
  constructor(
    private mallApiService: MallApiService,
  ) {}
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '쇼핑몰 API 조회' })
  @ApiResponse({ status: 200 })
  async findAllSellerApi(
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const result = await this.mallApiService.findAllSellerApi(sellerId);
    return {
      statusCode: 200,
      data: result
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '쇼핑몰 API 등록' })
  @ApiResponse({ status: 201 })
  async createSellerApi(
    @Body() createSellerApiDto: CreateSellerApiDto,
    @Request() req
  ) {
    const sellerId = req.user.uid;
    await this.mallApiService.createSellerApi(sellerId, createSellerApiDto);
    return {
      statusCode: 201,
      message: 'API 등록이 완료되었습니다.'
    }

  }



}
