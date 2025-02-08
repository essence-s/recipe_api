import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';
// import { Recipe } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadImageService: UploadImageService,
  ) {}

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

          ...(recipe.categories && {
            categories: {
              create: recipe.categories.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }),

          ...(recipe.ingredients && {
            ingredients: {
              create: [
                {
                  name: recipe.ingredients,
                },
              ],
            },
          }),

          // recipe.ingredients.map((ingredient) => ({
          //   name: ingredient,
          // ingredient: { connect: { id: ingredient.id } },
          // quantity: ingredient.quantity,
          // unit: ingredient.unit,
          // })),
          ...(recipe.instructions && {
            instructions: {
              create: [{ description: recipe.instructions }],
            },
          }),
        },
      });

      return recipeRes;
    } catch (error) {
      //No in production messague :V error.meta.cause
      // console.log(error);
      this.uploadImageService.deleteThumbnails(recipe.imageUrl);
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<{}> {
    // async findAll(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        ingredients: true,
      },
    });
    // return { hello: 'helooooo' };
    // return this.recipeRepository.find();
  }

  async findId(recipeId) {
    try {
      const result = await this.prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
        include: {
          categories: { select: { category: true } },
          ingredients: true,
          instructions: true,
        },
      });

      if (!result) {
        throw new BadRequestException(`Recipe with ID ${recipeId} not found`);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findTitle(recipeTitle) {
    try {
      const result = await this.prisma.recipe.findFirst({
        where: {
          title: recipeTitle,
        },
        include: {
          categories: { select: { category: true } },
          ingredients: true,
          instructions: true,
        },
      });

      if (!result) {
        throw new BadRequestException(
          `Recipe with Title ${recipeTitle} not found`,
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, recipe) {
    try {
      const recipeRes = await this.prisma.recipe.update({
        where: { id },
        data: {
          ...recipe,

          ...(recipe.categories && {
            categories: {
              deleteMany: {},
              create: recipe.categories.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }),
          // ingredients: undefined,
          // instructions: undefined,
          ...(recipe.ingredients && {
            ingredients: {
              deleteMany: {},
              create: [
                {
                  name: recipe.ingredients,
                },
              ],
            },
          }),

          ...(recipe.instructions && {
            instructions: {
              deleteMany: {},
              // where: {},
              create: [{ description: recipe.instructions }],
              // update: [{ description: recipe.instructions }],
            },
          }),
        },
      });

      return recipeRes;
    } catch (error) {
      //No in production messague :V error.meta.cause
      this.uploadImageService.deleteThumbnails(recipe.imageUrl);
      // console.log(error);
      throw new BadRequestException('Error updating recipe');
    }
  }
  // async findOne(id: number): Promise<Recipe> {
  //   return await this.recipeRepository.findOne({ where: { id } });
  // }

  remove(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
