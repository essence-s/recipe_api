import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UploadImageService } from 'src/shared/upload-image/upload-image.service';

@Injectable()
export class PendingRecipeService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  async createPendingRecipe({
    categories,
    ingredients,
    instructions,
    ...pendingRecipeG
  }) {
    // console.log({ pendingRecipe });
    try {
      let pendingRecipe: any = pendingRecipeG;
      const recipeRes = await this.prisma.pendingRecipe.create({
        data: {
          ...pendingRecipe,
          pendingCategories: {
            create: categories.map((categoryId) => ({
              pendingCategory: { connect: { id: +categoryId } },
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
    } catch (error) {
      this.uploadImageService.deleteThumbnails(pendingRecipeG.imageUrl);
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<{}> {
    return this.prisma.pendingRecipe.findMany();
  }

  async migratePendingRecipeToRecipe(pendingRecipeId: number, userId: number) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Obtener los datos de la receta pendiente
      const pendingRecipe = await tx.pendingRecipe.findUnique({
        where: { id: pendingRecipeId },
        include: {
          pendingCategories: true,
          pendingIngredients: true,
          pendingInstructions: true,
        },
      });

      if (!pendingRecipe) {
        throw new BadRequestException('La receta pendiente no existe');
      }

      // Insertar la receta en la tabla Recipe junto con las categorías e ingredientes relacionados
      const newRecipe = await tx.recipe.create({
        data: {
          title: pendingRecipe.title,
          description: pendingRecipe.description,
          // instructions: pendingRecipe.instructions,
          imageUrl: pendingRecipe.imageUrl,
          videoUrl: pendingRecipe.videoUrl,
          prepTime: pendingRecipe.prepTime,
          servings: pendingRecipe.servings,
          difficulty: pendingRecipe.difficulty,
          createdAt: pendingRecipe.createdAt,
          userId: userId,
          publicUserName: pendingRecipe.publicUserName,
          publicUserPhone: pendingRecipe.publicUserPhone,
          categories: {
            create: pendingRecipe.pendingCategories.map((pendingCategory) => ({
              categoryId: pendingCategory.pendingCategoryId,
            })),
          },
          ingredients: {
            create: [
              {
                name: pendingRecipe.pendingIngredients[0].name,
              },
            ],
          },
          instructions: {
            create: [
              { description: pendingRecipe.pendingInstructions[0].description },
            ],
          },
        },
      });

      // Eliminar las categorías e ingredientes pendientes
      // await tx.pendingRecipeCategory.deleteMany({
      //   where: { pendingRecipeId: pendingRecipe.id },
      // });

      // await tx.pendingRecipeIngredient.deleteMany({
      //   // where: { pendingRecipeId: pendingRecipe.id },
      // });

      // Eliminar la receta pendiente
      await tx.pendingRecipe.delete({
        where: { id: pendingRecipe.id },
      });

      return newRecipe;
    });

    return transaction;
  }
}
