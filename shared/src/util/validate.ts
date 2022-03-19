import { validate } from 'class-validator';

export const ValidateOptions = {
  disableErrorMessages: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  stopAtFirstError: true,
  whitelist: true,
};

export const strictValidate = (object: object) =>
  validate(object, ValidateOptions);
