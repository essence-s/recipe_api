import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePendingRecipeDto {
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

  @IsNotEmpty()
  @IsString()
  difficulty: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  userId: number;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  categories: number[];

  @IsNotEmpty()
  @IsString()
  ingredients: string;
}
