import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerReturnsService } from './returns.service';
import { WholesalerUpdateReturnDto } from './dto/wholesaler-update-return.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > returns')
@Controller('wholesaler')
export class WholesalerReturnsController {
  constructor(
    private wholesalerReturnsService: WholesalerReturnsService
  ) {}
  
  @Get('returns')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 반품 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '상품명 or 셀러명' })
  async findAllReturn(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
  ) {
    const wholesalerId = req.user.uid;
    const isCredit = false;
    const result = await this.wholesalerReturnsService.findAllReturn(wholesalerId, isCredit, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Patch('returns/return')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발] 반품 완료' })
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
  async updateReturns(
    @Body() wholesalerUpdateReturnDto: WholesalerUpdateReturnDto, 
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerReturnsService.updateReturns(wholesalerId, wholesalerUpdateReturnDto.ids);
    return {
      statusCode: 200,
      message: '등록 요청 상품 수정이 완료되었습니다.'
    };
  }
  
  @Get('returns/credit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 전잔 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '상품명 or 셀러명' })
  async findAllCredit(
    @Request() req,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
  ) {
    const wholesalerId = req.user.uid;
    const isCredit = true;
    const result = await this.wholesalerReturnsService.findAllReturn(wholesalerId, isCredit, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
}
