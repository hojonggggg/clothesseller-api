import { Body, ConflictException, Controller, ForbiddenException, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
//import { AuthService } from 'src/commons/shared/auth/auth.service';

import { AuthService } from './auth.service';
import { UsersService } from 'src/commons/shared/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetUserPasswordDto } from 'src/commons/shared/users/dto/reset-user-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '[완료] 로그인' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    console.log({loginDto});
    //return this.authService.login(req.user);
    const result = await this.authService.login(req.user);
    return {
      statusCode: 200,
      data: result
    }
  }

  @Post('password-reset')
  @ApiOperation({ summary: '임시 비밀번호 발급' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ResetUserPasswordDto })
  async resetPassword(@Request() req, @Body() resetUserPasswordDto: ResetUserPasswordDto) {
    console.log({resetUserPasswordDto});
    await this.usersService.resetPasswrod(resetUserPasswordDto);
    return {
      statusCode: 200,
      message: '임시 비밀번호 발급 신청이 완료되었습니다.'
    }
  }
}
