import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { Role } from '../../common/enums/role.enum';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() register: RegisterDto) {
  //   return await this.authService.register(register);
  // }

  @Post('login')
  async login(@Body() login: loginDto) {
    return this.authService.login(login);
  }

  @Get('profile')
  @Auth([Role.ADMIN])
  async profile(@ActiveUser() user: ActiveUserInterface) {
    return user;
  }
}
