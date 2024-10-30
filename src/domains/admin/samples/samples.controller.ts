import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { SamplesService } from 'src/commons/shared/samples/samples.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > samples')
@Controller('admin')
export class AdminSamplesController {
  constructor(
    private readonly samplesService: SamplesService
  ) {}
  
  @Get('samples')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '도매처명 or 셀러명 or 상품명' })
  async findAllSample(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('query') query: string
  ) {
    const result = await this.samplesService.findAllSampleForAdmin(query, paginationQuery);
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('sample/:sampleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 샘플 조회' })
  @ApiResponse({ status: 200 })
  async findOneSample(
    @Param('sampleId') sampleId: number, 
  ) {
    const result = await this.samplesService.findOneSampleForAdmin(sampleId);
    
    return {
      statusCode: 200,
      data: result
    };
  }
}
