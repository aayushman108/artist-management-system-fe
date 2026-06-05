declare namespace Common {
  interface IPagination {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
  }
}
