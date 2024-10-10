import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SellerAuthService } from './seller-auth.service';
import { UsersService } from 'src/commons/shared/users/users.service';
import { User } from 'src/commons/shared/users/entities/user.entity';
import { SellerSignupDto } from './dto/seller-signup.dto';

@ApiTags('seller > auth')
@Controller('seller/auth')
export class SellerAuthController {
  constructor(
    private sellerAuthService: SellerAuthService,
    private usersService: UsersService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '[완료] 회원가입' })
  @ApiResponse({ status: 201 })
  async createUser(@Body() sellerSignupDto: SellerSignupDto) {
    const user = await this.usersService.findOneUserById(sellerSignupDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
    //return await this.sellerAuthService.signup(sellerSignupDto);
    await this.sellerAuthService.signup(sellerSignupDto);

    return {
      statusCode: 201,
      message: '회원가입이 완료되었습니다.'
    };
  }
}
