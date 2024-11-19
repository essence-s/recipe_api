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
        categories: true,
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

  async migratePendingRecipeToRecipe(pendingRecipeId: number) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Obtener los datos de la receta pendiente
      const pendingRecipe = await tx.pendingRecipe.findUnique({
        where: { id: pendingRecipeId },
        include: {
          pendingCategories: true,
          pendingIngredients: true,
        },
      });

      if (!pendingRecipe) {
        throw new Error('La receta pendiente no existe');
      }

      // Insertar la receta en la tabla Recipe junto con las categorías e ingredientes relacionados
      const newRecipe = await tx.recipe.create({
        data: {
          title: pendingRecipe.title,
          description: pendingRecipe.description,
          // instructions: pendingRecipe.instructions,
          imageUrl: pendingRecipe.imageUrl,
          prepTime: pendingRecipe.prepTime,
          servings: pendingRecipe.servings,
          difficulty: pendingRecipe.difficulty,
          userId: pendingRecipe.userId,
          categories: {
            create: pendingRecipe.pendingCategories.map((pendingCategory) => ({
              categoryId: pendingCategory.pendingCategoryId,
            })),
          },
          ingredients: {
            // create: pendingRecipe.pendingIngredients.map(
            //   (pendingIngredient) => ({
            //     ingredientId: pendingIngredient.pendingIngredientId,
            //     quantity: pendingIngredient.quantity,
            //     unit: pendingIngredient.unit,
            //   }),
            // ),
          },
        },
      });

      // Eliminar las categorías e ingredientes pendientes
      await tx.pendingRecipeCategory.deleteMany({
        where: { pendingRecipeId: pendingRecipe.id },
      });

      await tx.pendingRecipeIngredient.deleteMany({
        // where: { pendingRecipeId: pendingRecipe.id },
      });

      // Eliminar la receta pendiente
      await tx.pendingRecipe.delete({
        where: { id: pendingRecipe.id },
      });

      return newRecipe;
    });

    return transaction;
  }

  remove(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
