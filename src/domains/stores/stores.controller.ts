import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly storeService: StoresService
  ) {}

  @Get()
  @ApiOperation({ summary: '상가 전체 조회' })
  @ApiResponse({ status: 200, type: [Store] })
  async findAllMalls() {
    return await this.storeService.findAllStore();
  }
}
