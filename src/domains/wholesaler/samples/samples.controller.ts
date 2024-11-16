import { Body, Controller, Delete, Get, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SamplesService } from 'src/commons/shared/samples/samples.service';
import { WholesalerSamplesService } from './samples.service';
import { WholesalerCreateSampleAutoDto } from './dto/wholesaler-create-sample-auto.dto';
import { WholesalerCreateSampleManualDto } from './dto/wholesaler-create-sample-manual.dto';
import { WholesalerReturnSampleDto } from './dto/wholesaler-return-sample.dto';
import { WholesalerDeleteSampleDto } from './dto/wholesaler-delete-sample.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('wholesaler > samples')
@Controller('wholesaler')
export class WholesalerSamplesController {
  constructor(
    private samplesService: SamplesService,
    private wholesalerSamplesService: WholesalerSamplesService
  ) {}

  @Post('sample/auto-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 등록 - 존재하는 셀러' })
  @ApiResponse({ status: 201 })
  async createSampleAuto(
    @Request() req,
    @Body() wholesalerCreateSampleAutoDto: WholesalerCreateSampleAutoDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerSamplesService.createSampleAuto(wholesalerId, wholesalerCreateSampleAutoDto);
    return {
      statusCode: 201,
      message: '샘플 등록이 완료되었습니다.'
    };
  }

  @Post('sample/manual-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 등록 - 존재하지 않는 셀러' })
  @ApiResponse({ status: 201 })
  async createSampleManual(
    @Request() req,
    @Body() wholesalerCreateSampleManualDto: WholesalerCreateSampleManualDto
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerSamplesService.createSampleManual(wholesalerId, wholesalerCreateSampleManualDto);
    return {
      statusCode: 201,
      message: '샘플 등록이 완료되었습니다.'
    };
  }

  @Get('samples')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 셀러 or 상품명' })
  async findAllSample(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    //const result = await this.wholesalerSamplesService.findAllSample(wholesalerId, query, paginationQueryDto);
    const result = await this.samplesService.findAllSampleByWholesalerId(wholesalerId, startDate, endDate, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('samples/monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 월간 샘플 반납 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회하려는 달' })
  async findAllSampleOfMonthly(
    @Request() req,
    @Query('month') month: string
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerSamplesService.findAllSampleOfMonthly(wholesalerId, month);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Get('samples/daily')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 일간 샘플 반납 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'day', required: true, description: '조회하려는 날' })
  async findAllSampleOfDaily(
    @Request() req,
    @Query('day') day: string
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerSamplesService.findAllSampleOfDaily(wholesalerId, day);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('samples/return')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 샘플 반납' })
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
  async returnSamples(
    @Request() req,
    @Body() wholesalerReturnSampleDto: WholesalerReturnSampleDto, 
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerSamplesService.returnSamples(wholesalerId, wholesalerReturnSampleDto.ids);
    return {
      statusCode: 200,
      message: '샘플 반납이 완료되었습니다.'
    };
  }

  @Delete('samples')  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 선택 샘플 삭제' })
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
    @Request() req,
    @Body() wholesalerDeleteSampleDto: WholesalerDeleteSampleDto, 
  ) {
    const wholesalerId = req.user.uid;
    await this.wholesalerSamplesService.deleteSamples(wholesalerId, wholesalerDeleteSampleDto.ids);
    return {
      statusCode: 200,
      message: '샘플 삭제가 완료되었습니다.'
    };
  }
}
