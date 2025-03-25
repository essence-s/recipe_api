import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/prismaFun/paginator';
import {
  PaginateRawFunction,
  paginatorRaw,
} from 'src/common/prismaFun/paginatorRaw';
import { PrismaService } from 'src/prisma.service';

// const paginate: PaginateFunction = paginator({ perPage: 4 });
const paginateRaw: PaginateRawFunction = paginatorRaw({ perPage: 4 });
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

    let whereClauses: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (query) {
      whereClauses.push(
        `r."title" ILIKE TRANSLATE($${paramIndex}, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ', 'aeiouAEIOUaeiouAEIOU')`,
      );
      queryParams.push(`%${query}%`);
      paramIndex++;
    }

    if (categories.length > 0) {
      whereClauses.push(`
        EXISTS (
          SELECT 1 FROM "RecipeCategory" rc2
          JOIN "Category" c2 ON rc2."categoryId" = c2."id"
          WHERE rc2."recipeId" = r."id"
          AND c2."name" IN (${categories.map((_, i) => `$${paramIndex + i}`).join(', ')})
        )
      `);
      queryParams.push(...categories);
    }

    const sqlQuery = `
      SELECT 
        r."id", 
        r."title", 
        r."description", 
        r."servings", 
        r."imageUrl",
        r."createdAt",
        r."updatedAt",
        json_build_object(
          'id', u."id",
          'username', u."username",
          'role', ur."name"
        ) AS "user",
        json_agg(DISTINCT to_jsonb(json_build_object('id', c."id", 'name', c."name"))) AS "categories"
      FROM "Recipe" r
      LEFT JOIN "User" u ON r."userId" = u."id"
      LEFT JOIN "Role" ur ON u."roleId" = ur."id"
      LEFT JOIN "RecipeCategory" rc ON r."id" = rc."recipeId"
      LEFT JOIN "Category" c ON rc."categoryId" = c."id"
      ${whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''}
      GROUP BY r."id", u."id", ur."name"
    `;

    const recipes = await paginateRaw(
      this.prisma,
      sqlQuery,
      queryParams,
      pagination,
    );

    //   const sqlQuery = `
    //   SELECT
    //     r."id",
    //     r."title",
    //     r."description",
    //     r."servings",
    //     r."imageUrl",
    //     u."username"
    //   FROM "Recipe" r
    //   LEFT JOIN "User" u ON r."userId" = u."id"
    //   WHERE
    //     TRANSLATE(r."title", 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ', 'aeiouAEIOUaeiouAEIOU')
    //     ILIKE TRANSLATE($1, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ', 'aeiouAEIOUaeiouAEIOU')
    // `;

    // const recipes = await paginate(
    //   this.prisma.recipe,

    //   {
    //     where: {
    //       AND: [
    //         {
    //           ...(query && {
    //             title: {
    //               contains: query,
    //               mode: 'insensitive',
    //             },
    //           }),
    //           // ...(difficulty && { difficulty: difficulty }),
    //           // OR: categories.map((category) => ({
    //           //   categories: {
    //           //     some: {
    //           //       category: {
    //           //         name: category,
    //           //       },
    //           //     },
    //           //   },
    //           // })),
    //         },
    //         {
    //           OR: categories.map((category) => ({
    //             categories: {
    //               some: {
    //                 category: {
    //                   name: category,
    //                 },
    //               },
    //             },
    //           })),
    //         },
    //         // ...categories.map((category) => ({
    //         //   categories: {
    //         //     some: {
    //         //       category: {
    //         //         name: category,
    //         //       },
    //         //     },
    //         //   },
    //         // })),
    //         // {},
    //       ],
    //     },
    //     include: {
    //       user: {
    //         select: {
    //           id: true,
    //           username: true,
    //           role: {
    //             select: {
    //               name: true,
    //             },
    //           },
    //         },
    //       },
    //       categories: {
    //         include: {
    //           category: {
    //             select: {
    //               name: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     ...pagination,
    //   },
    // );

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

  async findQueryRecipe(matches, pagination?) {
    let [query] = matches;

    // const page = { page: 2, perPage: 2 };
    const recipes = await this.prisma.$queryRaw`
    SELECT 
      r."id", 
      r."title", 
      r."description", 
      r."servings", 
      r."imageUrl", 
      u."username" 
    FROM "Recipe" r
    LEFT JOIN "User" u ON r."userId" = u."id"
    WHERE 
      TRANSLATE(r."title", 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ', 'aeiouAEIOUaeiouAEIOU') 
      ILIKE TRANSLATE(${`%${query}%`}, 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ', 'aeiouAEIOUaeiouAEIOU')
    LIMIT 5;
  `;

    //     const recipes = await this.prisma.$queryRaw`
    // SELECT
    //   r.id,
    //   r.title,
    //   r.description,
    //   r.servings,
    //   r."imageUrl",
    //   u.username
    // FROM "Recipe" r
    // LEFT JOIN "User" u ON r."userId" = u.id
    // WHERE r.title ILIKE ${`%${query}%`}
    // LIMIT 5;
    // `;

    // const recipes = await this.prisma.recipe.findMany({
    //   where: {
    //     ...(query && {
    //       title: {
    //         contains: query,
    //         mode: 'insensitive',
    //       },
    //     }),
    //   },
    //   select: {
    //     id: true,
    //     title: true,
    //     description: true,
    //     servings: true,
    //     imageUrl: true,
    //     user: { select: { username: true } },
    //   },
    //   take: 5,
    // });
    // console.log(recipes);
    return recipes;
  }
}

// async findMatchesRecipes(matches, pagination?) {
//   let [query, categoriesParam] = matches;

//   query = query != 'undefined' ? query : '';
//   const categories =
//     categoriesParam != 'undefined'
//       ? categoriesParam
//         ? categoriesParam.split('|')
//         : []
//       : [];

//   const recipes = await paginate(
//     this.prisma.recipe,

//     {
//       where: {
//         AND: [
//           {
//             ...(query && {
//               title: {
//                 contains: query,
//                 mode: 'insensitive',
//               },
//             }),

//           },
//           {
//             OR: categories.map((category) => ({
//               categories: {
//                 some: {
//                   category: {
//                     name: category,
//                   },
//                 },
//               },
//             })),
//           },

//         ],
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             username: true,
//             role: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//         categories: {
//           include: {
//             category: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       ...pagination,
//     },
//   );

//   return recipes;
// }
