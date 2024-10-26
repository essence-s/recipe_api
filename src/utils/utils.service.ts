import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService) {}

  async deleteAll() {
    try {
      await this.prisma.recipeIngredient.deleteMany({});
      await this.prisma.recipeCategory.deleteMany({});
      // await this.prisma.ingredient.deleteMany({});
      await this.prisma.category.deleteMany({});

      const result = await this.prisma.recipe.deleteMany({});

      //esto funciona solo para sqlite tener en cuenta
      await this.prisma
        .$executeRaw`DELETE FROM sqlite_sequence WHERE name='Ingredient'`;
      await this.prisma
        .$executeRaw`DELETE FROM sqlite_sequence WHERE name='Category'`;

      console.log(`Se eliminaron ${result.count} recetas.`);
    } catch (error) {
      console.log('no se eliminaron', error);
    }
  }

  async utilCreateManyRoles(createRoleDto) {
    return this.prisma.role.createMany({ data: createRoleDto });
  }

  async createRecipesUtils(recipes) {
    // console.log({ recipes });

    const recipeRes = await this.prisma.$transaction(
      recipes.map((recipe) =>
        this.prisma.recipe.create({
          data: {
            ...recipe,
            categories: {
              create: recipe.categories.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            },
            ingredients: {
              create: recipe.ingredients.map((ingredient) => ({
                ingredient: { connect: { id: ingredient.id } },
                quantity: ingredient.quantity,
                unit: ingredient.unit,
              })),
            },
          },
        }),
      ),
    );

    return recipeRes;
  }
}
