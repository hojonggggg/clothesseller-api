import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/commons/shared/users/users.service';
import { WholesalerSignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WholesalerAuthService {
  constructor(
    private usersService: UsersService,
    //private jwtService: JwtService
  ) {}

  async signup(wholesalerSignupDto: WholesalerSignupDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(wholesalerSignupDto.password, 10);
    const { id, licenseNumber, name, mobile, mallId, roomNo } = wholesalerSignupDto;
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
