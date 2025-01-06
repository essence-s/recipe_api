import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum UserState {
  active = 'active',
  disable = 'disable',
}

export class UserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;

  @IsNumber()
  roleId: number;

  @IsEnum(UserState, { message: 'State must be either active or disable' })
  state: UserState;
}
