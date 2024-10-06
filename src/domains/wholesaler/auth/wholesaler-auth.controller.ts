import { Body, ConflictException, Controller, Post } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
//import { AuthService } from 'src/commons/shared/auth/auth.service';
import { WholesalerAuthService } from './wholesaler-auth.service';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { WholesalerSignupDto } from './dto/wholesaler-signup.dto';
//import { LoginDto } from 'src/commons/shared/auth/dto/login.dto';

@ApiTags('wholesaler > auth')
@Controller('wholesaler/auth')
export class WholesalerAuthController {
  constructor(
    //private authService: AuthService,
    private wholesalerAuthService: WholesalerAuthService,
    private usersService: UsersService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, type: User })
  async createUser(@Body() wholesalerSignupDto: WholesalerSignupDto) {
    const user = await this.usersService.findOneUserById(wholesalerSignupDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
    return await this.wholesalerAuthService.signup(wholesalerSignupDto);
  }
  /*
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    console.log({loginDto});
    return this.authService.login(req.user);
  }
  */
}
