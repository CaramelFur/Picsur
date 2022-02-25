import {
  Equals,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class BaseApiResponse<T extends Object, W extends boolean> {
  @IsBoolean()
  @IsDefined()
  success: W;

  @IsInt()
  @Min(0)
  @Max(1000)
  @IsDefined()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @ValidateNested()
  @IsDefined()
  data: T;
}

export class ApiSuccessResponse<T extends Object> extends BaseApiResponse<
  T,
  true
> {}

export class ApiErrorData {
  @IsString()
  @IsNotEmpty()
  message: string;
}
export class ApiErrorResponse extends BaseApiResponse<ApiErrorData, false> {}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
