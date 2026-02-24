type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  filters?: Record<string, any>;
};

type PaginationResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export default async function paginateMongo<T>(
  model: any,
  {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    filters = {},
  }: PaginationParams,
): Promise<PaginationResult<T>> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(limit, 100);
  const skip = (safePage - 1) * safeLimit;
  console.log(safePage, safeLimit, skip);
  // Count total
  const totalItems = await model.countDocuments(filters);

  // Fetch data
  const data = await model
    .find(filters)
    .sort(sort)
    .skip(skip)
    .limit(safeLimit)
    .lean();

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
}
