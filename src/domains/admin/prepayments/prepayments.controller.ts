import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { PrepaymentsService } from 'src/commons/shared/prepayments/prepayments.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > prepayments')
@Controller('admin')
export class AdminPrepaymentsController {
  constructor(
    private prepaymentsService: PrepaymentsService,
  ) {}
  
  @Get('prepayments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '도매처명 or 셀러명 or 상품명' })
  async findAllPrepayment(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    const result = await this.prepaymentsService.findAllPrepaymentForAdmin(query, paginationQueryDto);
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('prepayment/:wholesalerOrderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 미송 조회' })
  @ApiResponse({ status: 200 })
  async findOnePrepayment(
    @Param('wholesalerOrderId') wholesalerOrderId: number, 
  ) {
    const result = await this.prepaymentsService.findOnePrepaymentForAdmin(wholesalerOrderId);
    
    return {
      statusCode: 200,
      data: result
    };
  }
}
