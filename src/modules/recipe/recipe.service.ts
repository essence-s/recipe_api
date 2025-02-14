import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RevalidateService } from 'src/shared/revalidate/revalidate.service';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadImageService: UploadImageService,
    private revalidateService: RevalidateService,
  ) {}

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

      this.revalidateService.revalidate('/search');

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
            role: {
              select: {
                name: true,
              },
            },
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
        instructions: true,
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
          user: {
            select: {
              id: true,
              username: true,
              role: {
                select: {
                  name: true,
                },
              },
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

      this.revalidateService.revalidate('/search');

      return recipeRes;
    } catch (error) {
      //No in production messague :V error.meta.cause
      this.uploadImageService.deleteThumbnails(recipe.imageUrl);
      // console.log(error);
      throw new BadRequestException('Error updating recipe');
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.recipe.delete({ where: { id } });
      this.revalidateService.revalidate('/search');

      return data;
    } catch (error) {
      throw new BadRequestException('Error updating recipe');
    }
  }
}
