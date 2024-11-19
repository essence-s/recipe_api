import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PendingRecipeService {
  constructor(private prisma: PrismaService) {}

  async createPendingRecipe(pendingRecipe) {
    // console.log({ pendingRecipe });
    const recipeRes = this.prisma.pendingRecipe.create({
      data: {
        ...pendingRecipe,
        pendingCategories: {
          create: pendingRecipe.pendingCategories.map((categoryId) => ({
            pendingCategory: { connect: { id: categoryId } },
          })),
        },
        pendingIngredients: {
          create: [
            {
              name: pendingRecipe.ingredients,
            },
          ],
        },
        instructions: {
          create: [{ description: pendingRecipe.instructions }],
        },
      },
    });

    return recipeRes;
  }

  async findAll(): Promise<{}> {
    return this.prisma.pendingRecipe.findMany();
  }
}
