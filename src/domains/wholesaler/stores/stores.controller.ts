import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';

@ApiTags('wholesaler > stores')
@Controller('wholesaler/stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService
  ) {}

  @Get()
  @ApiOperation({ summary: '[완료] 상가 전체 조회' })
  @ApiResponse({ status: 200 })
  async findAllStore() {
    const result = await this.storesService.findAllStore();
    return {
      statusCode: 200,
      data: result
    };
  }
}
