export interface PaginationFiltersInterface {
  category?: string;
  brand?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
  name?: {
    $regex: string;
    $options: string;
  };
}
