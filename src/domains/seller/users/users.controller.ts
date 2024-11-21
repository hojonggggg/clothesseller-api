import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/commons/shared/users/users.service';
import { UpdateUserProfileDto } from 'src/commons/shared/users/dto/update-user-profile.dto';

@ApiTags('seller > users')
@Controller()
export class SellerUsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('seller/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 200 })
  async me(
    @Request() req
  ) {
    const { uid, role } = req.user;
    const userId = uid;
    const result = await this.usersService.me(userId, role);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('seller/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ status: 200 })
  async updateMe(
    @Request() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto, 
  ) {
    const { uid, role } = req.user;
    const userId = uid;
    await this.usersService.updateMe(userId, role, updateUserProfileDto);
    return {
      statusCode: 200,
      message: '내 정보 수정이 완료되었습니다.'
    };
  }

  @Get('seller/wholesalers')
  @ApiOperation({ summary: '도매처 조회' })
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
