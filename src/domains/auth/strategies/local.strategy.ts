import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'id',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any, 
    id: string,
    password: string,
  ): Promise<any> {
    console.log('LocalStrategy: validate called', { id, password });
    const user = await this.authService.validateUser(id, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}