import { Body, Controller, Delete, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WholesalerSamplesService } from './samples.service';
import { Sample } from 'src/commons/shared/entities/sample.entity';
import { WholesalerCreateSampleAutoDto } from './dto/wholesaler-create-sample-auto.dto';
import { WholesalerCreateSampleManualDto } from './dto/wholesaler-create-sample-manual.dto';
import { WholesalerDeleteSampleDto } from './dto/wholesaler-delete-sample.dto';
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
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.wholesalerSamplesService.findAllSample(wholesalerId, query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
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
