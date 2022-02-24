export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  data: T;
}

export type ApiErrorResponse = ApiResponse<{
  message: string;
}>;

export type ApiUploadResponse = ApiResponse<{
  hash: string;
}>;
