import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MemoRoleModule } from 'src/shared/memo-role/memo-role.module';
import { UsersModule } from 'src/modules/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // MemoRoleModule,

    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
