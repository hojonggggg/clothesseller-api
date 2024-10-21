import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WholesalerAuthService } from './wholesaler-auth.service';
import { UsersService } from 'src/commons/shared/users/users.service';
import { WholesalerSignupDto } from './dto/wholesaler-signup.dto';

@ApiTags('wholesaler > auth')
@Controller('wholesaler/auth')
export class WholesalerAuthController {
  constructor(
    private wholesalerAuthService: WholesalerAuthService,
    private usersService: UsersService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '[완료] 회원가입' })
  @ApiResponse({ status: 201 })
  async createUser(@Body() wholesalerSignupDto: WholesalerSignupDto) {
    const user = await this.usersService.findOneUserById(wholesalerSignupDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    await this.wholesalerAuthService.signup(wholesalerSignupDto);

    return {
      statusCode: 201,
      message: '회원가입이 완료되었습니다.'
    };
  }
}
