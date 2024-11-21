import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/commons/shared/users/users.service';
import { UpdateUserProfileDto } from 'src/commons/shared/users/dto/update-user-profile.dto';
import { UpdateUserPasswordDto } from 'src/commons/shared/users/dto/update-user-password.dto';

@ApiTags('wholesaler > users')
@Controller()
export class WholesalerUsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('wholesaler/me')
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

  @Patch('wholesaler/me')
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

  @Patch('wholesaler/me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '비밀번호 수정' })
  @ApiResponse({ status: 200 })
  async updatePassword(
    @Request() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto, 
  ) {
    const userId = req.user.uid;
    await this.usersService.updatePassword(userId, updateUserPasswordDto);
    return {
      statusCode: 200,
      message: '비밀번호 수정이 완료되었습니다.'
    };
  }

  @Get('wholesaler/users/sellers')
  @ApiOperation({ summary: '[완료] 셀러 조회' })
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
