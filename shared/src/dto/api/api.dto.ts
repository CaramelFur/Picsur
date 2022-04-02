import {
  IsBoolean, IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min
} from 'class-validator';

class BaseApiResponse<T extends Object, W extends boolean> {
  @IsBoolean()
  success: W;

  @IsInt()
  @Min(0)
  @Max(1000)
  statusCode: number;

  @IsString()
  timestamp: string;

  @IsNotEmpty()
  data: T;
}

export class ApiSuccessResponse<T extends Object> extends BaseApiResponse<
  T,
  true
> {}

export class ApiErrorData {
  @IsString()
  message: string;
}
export class ApiErrorResponse extends BaseApiResponse<ApiErrorData, false> {}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
