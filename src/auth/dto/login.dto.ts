import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class loginDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  phoneOrEmail: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
