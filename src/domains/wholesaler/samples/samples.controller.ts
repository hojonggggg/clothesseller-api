import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerSamplesService } from './samples.service';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > samples')
@Controller('wholesaler')
export class WholesalerSamplesController {
  constructor(
    private wholesalerSamplesService: WholesalerSamplesService
  ) {}

  @Post('sample/auto-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발중] 샘플 등록 - 존재하는 셀러' })
  @ApiResponse({ status: 201 })
  async createSample(
    //@Body() createWholesalerProductDto: CreateWholesalerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    /*
    const { code } = createWholesalerProductDto;
    const product = await this.wholesalerProductsService.findOneWholesalerProductByWholesalerIdAndCode(wholesalerId, code);
    if (product) {
      throw new ConflictException('이미 등록된 상품입니다.');
    }
    return await this.wholesalerProductsService.createWholesalerProduct(wholesalerId, createWholesalerProductDto);
    */
  }

  @Get('samples')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발중] 샘플 목록 조회' })
  @ApiResponse({ status: 200 })
  async findAllSampleByWholesalerId(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerSamplesService.findAllSampleByWholesalerId(wholesalerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Delete('samples')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발중] 선택 샘플 삭제' })
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
  async deleteSamples(
    //@Body() deleteSellerProductDto: DeleteSellerProductDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    //await this.wholesalerProductsService.deleteWholesalerProduct(wholesalerId, deleteSellerProductDto.ids);
    return {
      statusCode: 200,
      message: '샘플 삭제가 완료되었습니다.'
    };
  }
}
