import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async validateUser(id: string, password: string): Promise<any> {
    console.log("validateUser");
    const user = await this.usersService.findOneUserById(id);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: any) {
    const payload = { role: user.role, id: user.id, sub: user.uid };
    return {
      role: user.role, 
      accessToken: this.jwtService.sign(payload)
    };
  }
}
