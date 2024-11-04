import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CategoryGroupDto {
  @IsOptional()
  id?: number;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;
}
