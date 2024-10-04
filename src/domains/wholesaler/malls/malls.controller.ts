import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MallsService } from './malls.service';
import { Mall } from './entities/mall.entity';

@ApiTags('wholesaler/malls')
@Controller('wholesaler/malls')
export class MallsController {
  constructor(
    private readonly mallsService: MallsService
  ) {}

  @Get()
  @ApiOperation({ summary: '판매몰 전체 조회' })
  @ApiResponse({ status: 200, type: [Mall] })
  async findAllMalls() {
    return await this.mallsService.findAllMall();
  }

}
