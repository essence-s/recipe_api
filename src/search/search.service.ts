import { Injectable } from '@nestjs/common';
import { title } from 'process';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async findCategory(category: string) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        categories: {
          some: {
            category: {
              name: category.toLowerCase(),
            },
          },
        },
      },
      include: {
        categories: true,
        ingredients: true,
      },
    });

    return recipes;
  }

  async findMatchesTitleRecipe(matches: string) {
    console.log(matches);
    const recipes = await this.prisma.recipe.findMany({
      where: {
        title: {
          contains: matches,
          // mode: 'insensitive',
        },
      },
      // include: {
      //   categories: true,
      //   ingredients: true,
      // },
    });
  }

  async findMatchesRecipe(matches) {
    let [query, categoriesParam] = matches;
    console.log(categoriesParam);
    const categories =
      categoriesParam != 'undefined' && categoriesParam
        ? categoriesParam.split(',')
        : [];
    console.log(categories);
    const recipes = await this.prisma.recipe.findMany({
      where: {
        AND: [
          {
            title: {
              contains: query,
              // mode: 'insensitive',
            },
          },
          ...categories.map((category) => ({
            categories: {
              some: {
                category: {
                  name: category,
                },
              },
            },
          })),
        ],
      },
      // include: {
      //   categories: true,
      //   ingredients: true,
      // },
    });

    // {
    //   categories: {
    //     some: {
    //       category: {
    //         name: {
    //           in: categories,
    //         },
    //       },
    //     },
    //   },
    // },

    return recipes;
  }
}
