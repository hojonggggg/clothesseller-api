import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/commons/shared/users/users.service';

@ApiTags('seller > users')
@Controller('seller/users')
export class SellerUsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  @ApiOperation({ summary: '[완료] 도매처 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '검색할 도매처명' })
  async findAllSellerProductBySellerId(
    @Query('query') query: string
  ) {
    const result = await this.usersService.findAllWholesaler(query);
    return {
      statusCode: 200,
      data: result
    };
  }


}
