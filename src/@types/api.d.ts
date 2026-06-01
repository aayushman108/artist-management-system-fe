declare namespace Api {
  interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
}
