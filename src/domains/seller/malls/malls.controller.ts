import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MallsService } from './malls.service';
import { Mall } from './entities/mall.entity';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('seller > malls')
@Controller('seller/malls')
export class MallsController {
  constructor(
    private readonly mallsService: MallsService
  ) {}

  @Get()
  @ApiOperation({ summary: '[완료] 판매몰 전체 조회' })
  @ApiResponse({ status: 200 })
  async findAllMall(
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    //return await this.mallsService.findAllMall();
    const result = await this.mallsService.findAllMall(paginationQuery);
    return {
      statusCode: 200,
      data: result
    };
  }

}
