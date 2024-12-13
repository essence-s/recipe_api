import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

enum RecipeDifficulty {
  facil = 'facil',
  medio = 'medio',
  dificil = 'dificil',
}
export class CreatePublicPendingRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  prepTime: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  servings: number;

  @IsEnum(RecipeDifficulty, {
    message: 'the difficulty should be easy, facil, medio or dificil',
  })
  difficulty: RecipeDifficulty;

  // @Type(() => Number)
  // @IsInt()
  // @Min(0)
  // userId: number;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  categories: number[];

  @IsNotEmpty()
  @IsString()
  ingredients: string;

  @IsNotEmpty()
  @IsString()
  publicUserName: string;

  @IsNotEmpty()
  @IsString()
  publicUserPhone: string;
}
