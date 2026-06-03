declare namespace Api {
  interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  interface PaginatedData<T> {
    data: T[];
    pagination: Pagination;
  }

  type PaginatedResponse<T> = BaseResponse<PaginatedData<T>>;
}
