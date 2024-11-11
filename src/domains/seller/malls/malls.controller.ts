import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MallsService } from 'src/commons/shared/malls/malls.service';

@ApiTags('seller > malls - 상품 등록할 때 사용')
@Controller('seller/malls')
export class SellerMallsController {
  constructor(
    private readonly mallsService: MallsService
  ) {}

  @Get()
  @ApiOperation({ summary: '[완료] 판매몰 전체 조회' })
  @ApiResponse({ status: 200 })
  async findAllMall() {
    const result = await this.mallsService.findAllMall();
    return {
      statusCode: 200,
      data: result
    };
  }
}
