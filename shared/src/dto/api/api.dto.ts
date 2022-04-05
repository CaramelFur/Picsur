import z from 'zod';

const ApiResponseBase = z.object({
  statusCode: z.number().min(0).max(600),
  timestamp: z.string(),
});

const ApiSuccessResponse = <T extends z.AnyZodObject>(data: T) =>
  ApiResponseBase.merge(
    z.object({
      success: z.literal(true),
      data,
    }),
  );

const ApiErrorResponse = ApiResponseBase.merge(
  z.object({
    success: z.literal(false),
    data: z.object({
      message: z.string(),
    }),
  }),
);

export const ApiResponseSchema = <T extends z.AnyZodObject>(data: T) =>
  ApiErrorResponse.or(ApiSuccessResponse(data));

export type ApiErrorResponse = z.infer<typeof ApiErrorResponse>;

const ApiAnySuccessResponseSchema = ApiSuccessResponse(z.object({}))
  .omit({ data: true })
  .merge(
    z.object({
      data: z.any(),
    }),
  );
export type ApiAnySuccessResponse = z.infer<typeof ApiAnySuccessResponseSchema>;
