import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from 'src/common/prismaFun/paginator';
import { PrismaService } from 'src/prisma.service';

const paginate: PaginateFunction = paginator({ perPage: 4 });
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

  // probandoo
  async findManyGG(matches): Promise<PaginatedResult<Recipe>> {
    let [query, categoriesParam] = matches;
    console.log(categoriesParam);
    const categories =
      categoriesParam != 'undefined' && categoriesParam
        ? categoriesParam.split(',')
        : [];
    console.log(categories);
    const page = { page: 2, perPage: 2 };

    return paginate(
      this.prisma.recipe,
      {
        where: {
          AND: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            // ...categories.map((category) => ({
            //   categories: {
            //     some: {
            //       category: {
            //         name: category,
            //       },
            //     },
            //   },
            // })),
          ],
        },
        // orderBy,
      },
      {
        ...page,
      },
    );
  }

  async findMatchesRecipe(matches, pagination?) {
    let [query, difficulty, categoriesParam] = matches;
    console.log(matches);
    console.log(pagination);
    query = query != 'undefined' ? query : '';
    const categories =
      categoriesParam != 'undefined'
        ? categoriesParam
          ? categoriesParam.split(',')
          : []
        : [];
    console.log(query);
    console.log(categories);

    // const page = { page: 2, perPage: 2 };

    const recipes = await paginate(
      this.prisma.recipe,

      {
        where: {
          AND: [
            {
              ...(query && {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              }),
              ...(difficulty && { difficulty: difficulty }),
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
            {},
          ],
        },
        // include: {
        //   categories: true,
        //   ingredients: true,
        // },
      },
      {
        ...pagination,
      },
    );

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
