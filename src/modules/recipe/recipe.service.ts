import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { create } from 'domain';
import { PrismaService } from 'src/prisma.service';
// import { Recipe } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  // async create(createRecipeDto): Promise<Recipe[]> {
  //   // async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
  //   const recipe = this.recipeRepository.create(createRecipeDto);
  //   return await this.recipeRepository.save(recipe);
  // }

  async createRecipe(recipe) {
    // console.log({ recipe });
    try {
      const recipeRes = await this.prisma.recipe.create({
        data: {
          ...recipe,
          categories: {
            create: recipe.categories.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
          ingredients: {
            create: [
              {
                name: recipe.ingredients,
              },
            ],

            // recipe.ingredients.map((ingredient) => ({
            //   name: ingredient,
            // ingredient: { connect: { id: ingredient.id } },
            // quantity: ingredient.quantity,
            // unit: ingredient.unit,
            // })),
          },
          instructions: {
            create: [{ description: recipe.instructions }],
          },
        },
      });

      return recipeRes;
    } catch (error) {
      //No in production messague :V error.meta.cause
      console.log(error);
      throw new BadRequestException(error.meta.cause);
    }
  }

  async findAll(): Promise<{}> {
    // async findAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({
      include: {
        categories: true,
        ingredients: true,
      },
    });
    // return { hello: 'helooooo' };
    // return this.recipeRepository.find();
  }

  async findId(recipeId): Promise<{}> {
    return this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      include: {
        categories: { select: { category: true } },
        ingredients: true,
        instructions: true,
      },
    });
  }

  async update(id: number, recipe) {
    try {
      const recipeRes = await this.prisma.recipe.update({
        where: { id },
        data: {
          ...recipe,

          categories: {
            deleteMany: {},
            create: recipe.categories.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
          // ingredients: undefined,
          // instructions: undefined,
          ingredients: {
            deleteMany: {},
            create: [
              {
                name: recipe.ingredients,
              },
            ],
          },
          instructions: {
            deleteMany: {},
            // where: {},
            create: [{ description: recipe.instructions }],
            // update: [{ description: recipe.instructions }],
          },
        },
      });

      return recipeRes;
    } catch (error) {
      //No in production messague :V error.meta.cause
      console.log(error);
      throw new BadRequestException(error.meta.cause);
    }
  }
  // async findOne(id: number): Promise<Recipe> {
  //   return await this.recipeRepository.findOne({ where: { id } });
  // }

  remove(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
