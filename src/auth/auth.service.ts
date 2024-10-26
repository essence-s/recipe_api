import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // async register(register: RegisterDto) {
  //   return this.usersService.create({
  //     username: register.username,
  //     email: register.email,
  //     password: await bcrypt.hash(register.password, 10),
  //     roleId: register.roleId,
  //   });
  // }

  async login(login: loginDto) {
    const user = await this.usersService.findOneByUsername(login.username);
    // console.log(user);
    if (!user) {
      throw new UnauthorizedException('username is wrong');
    }

    const isPasswordValid = await bcrypt.compare(login.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('password invalid');
    }

    const payload = { username: user.username, role: user.role.name };

    const token = await this.jwtService.signAsync(payload);

    return {
      username: user.username,
      token,
    };
  }

  // async profile({email,rol})
}
