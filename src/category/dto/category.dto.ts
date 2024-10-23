import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class categoryDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;
}