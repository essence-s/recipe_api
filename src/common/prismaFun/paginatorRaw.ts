export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
// export type PaginateFunction = <T, K>(
//   model: any,
//   args?: K,
//   options?: PaginateOptions,
// ) => Promise<PaginatedResult<T>>;

export type PaginateRawFunction = (
  prisma: any,
  query: string,
  params: any[],
  options?: PaginateOptions,
) => Promise<PaginatedResult<any>>;

export const paginatorRaw = (
  defaultOptions: PaginateOptions,
): PaginateRawFunction => {
  return async (prisma, query: string, params: any[], options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const offset = (page - 1) * perPage;

    // Contar total de resultados
    const countQuery = `SELECT COUNT(*) AS total FROM (${query}) AS count_table`;
    const totalQuery = (await prisma.$queryRawUnsafe(
      countQuery,
      ...params,
    )) as { total: number }[];
    // console.log({ params });
    // const total = totalQuery[0]?.total || 0;
    const total = Number(totalQuery[0]?.total || 0);

    // Obtener los datos paginados
    const paginatedQuery = `${query} LIMIT ${perPage} OFFSET ${offset}`;
    const dataQuery = await prisma.$queryRawUnsafe(paginatedQuery, ...params);

    const lastPage = Math.ceil(total / perPage);

    return {
      data: dataQuery,
      meta: {
        total,
        lastPage,
        perPage,
        currentPage: page,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
