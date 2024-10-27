import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/commons/shared/users/users.service';

@ApiTags('wholesaler > users')
@Controller('wholesaler')
export class WholesalerUsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('sellers')
  @ApiOperation({ summary: '[개발] 셀러 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '셀러명' })
  async findAllSeller(
    @Query('query') query: string
  ) {
    const result = await this.usersService.findAllSeller(query);
    return {
      statusCode: 200,
      data: result
    };
  }
}
