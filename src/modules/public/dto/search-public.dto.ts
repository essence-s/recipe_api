import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

enum RecipeDifficulty {
  facil = 'facil',
  medio = 'medio',
  dificil = 'dificil',
}

export class SearchPublicDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(RecipeDifficulty)
  difficulty?: RecipeDifficulty;

  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  perPage?: number;
}
