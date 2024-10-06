import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/commons/shared/users/users.service';
import { SellerSignupDto } from './dto/seller-signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerAuthService {
  constructor(
    private usersService: UsersService
  ) {}

  async signup(signupDto: SellerSignupDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const { id, licenseNumber, name, mobile, address1, address2 } = signupDto;
    const createSellerDto = {
      id,
      password: hashedPassword,
      role: 'SELLER',
      licenseNumber,
      name,
      mobile,
      address1,
      address2
    };
    return await this.usersService.createUser(createSellerDto);
  }

}
