declare namespace Api {
  interface BaseResponse<T> {
    success: boolean;
    data: {
      message: string;
      data: T;
    };
  }
}
