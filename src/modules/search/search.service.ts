import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/prismaFun/paginator';
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

  async findMatchesRecipe(matches, pagination?) {
    let [query, categoriesParam] = matches;
    // console.log(matches);
    // console.log(pagination);
    query = query != 'undefined' ? query : '';
    const categories =
      categoriesParam != 'undefined'
        ? categoriesParam
          ? categoriesParam.split('|')
          : []
        : [];
    // console.log(query);
    // console.log(categories);

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
              // ...(difficulty && { difficulty: difficulty }),
            },
            {
              OR: categories.map((category) => ({
                categories: {
                  some: {
                    category: {
                      name: category,
                    },
                  },
                },
              })),
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
            {},
          ],
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
        },
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
