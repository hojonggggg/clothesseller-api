import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/commons/shared/users/users.service';
import { WholesalerSignupDto } from './dto/wholesaler-signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WholesalerAuthService {
  constructor(
    private usersService: UsersService
  ) {}

  async signup(signupDto: WholesalerSignupDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const { id, licenseNumber, name, mobile, mallId, roomNo } = signupDto;
    const createWholesalerDto = {
      id,
      password: hashedPassword,
      role: 'WHOLESALER',
      licenseNumber,
      name,
      mobile,
      mallId,
      roomNo
    };
    return await this.usersService.createUser(createWholesalerDto);
  }

}
