import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class loginDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
