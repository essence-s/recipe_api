import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: loginDto) {
    const user = await this.usersService.findOneByPhoneOrEmail(
      login.phoneOrEmail,
    );
    // console.log(user);
    if (!user) {
      throw new UnauthorizedException('phone or email is wrong');
    }

    if (user.state == 'disable') {
      throw new UnauthorizedException('account is disabled');
    }

    const isPasswordValid = await bcrypt.compare(login.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('password invalid');
    }

    const payload = {
      username: user.username,
      role: user.role.name,
      idRole: user.role.id,
      userId: user.id,
    };
    // console.log(payload);
    const token = await this.jwtService.signAsync(payload);

    return {
      username: user.username,
      token,
    };
  }
}
