import { Controller, Post, UseGuards, Request, Body, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  //@ApiResponse({ status: 201, type: User })
  async createUser(@Body() signupDto: SignupDto) {
    const user = await this.usersService.findOneUserById(signupDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
    return await this.usersService.createUser(signupDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    console.log({loginDto});
    return this.authService.login(req.user);
  }
}
