import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserState {
  active = 'active',
  disable = 'disable',
}

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  phone: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  roleId: number;

  @IsEnum(UserState, { message: 'State must be either active or disable' })
  state: UserState;
}
