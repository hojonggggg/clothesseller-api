import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WeekProductsService } from 'src/commons/shared/week-products/week-products.service';
import { SetWeekProductDto } from 'src/commons/shared/week-products/dto/set-week-product.dto';

@ApiTags('admin > week-products')
@Controller('admin')
export class AdminWeekProductsController {
  constructor(
    private readonly weekProductsService: WeekProductsService
  ) {}

  @Post('week-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 금주의 상품 등록' })
  @ApiResponse({ status: 200 })
  async setWeekProduct(
    @Body() setWeekProductDto: SetWeekProductDto
  ) {
    await this.weekProductsService.setWeekProduct(setWeekProductDto);
    return {
      statusCode: 200,
      message: '금주의 상품 등록이 완료되었습니다.'
    };
  }

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
