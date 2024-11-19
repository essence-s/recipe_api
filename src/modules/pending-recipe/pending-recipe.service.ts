import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PendingRecipeService {
  constructor(private prisma: PrismaService) {}

  async createPendingRecipe({
    categories,
    ingredients,
    instructions,
    ...pendingRecipeG
  }) {
    // console.log({ pendingRecipe });
    let pendingRecipe: any = pendingRecipeG;
    const recipeRes = await this.prisma.pendingRecipe.create({
      data: {
        ...pendingRecipe,
        pendingCategories: {
          create: categories.map((categoryId) => ({
            pendingCategory: { connect: { id: categoryId } },
          })),
        },
        pendingIngredients: {
          create: [
            {
              name: ingredients,
            },
          ],
        },
        pendingInstructions: {
          create: [{ description: instructions }],
        },
      },
    });

    return recipeRes;
  }

  async findAll(): Promise<{}> {
    return this.prisma.pendingRecipe.findMany();
  }
}
