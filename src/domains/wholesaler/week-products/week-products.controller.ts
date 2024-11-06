import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeekProductsService } from 'src/commons/shared/week-products/week-products.service';

@ApiTags('wholesaler > week-products')
@Controller('wholesaler')
export class WholesalerWeekProductsController {
  constructor(
    private readonly weekProductsService: WeekProductsService
  ) {}

  @Get('week-products')
  @ApiOperation({ summary: '[완료] 금주의 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  async findAllWeekProduct() {
    const result = await this.weekProductsService.findAllWeekProduct();

    return {
      statusCode: 200,
      data: result,
    }
  }

}
