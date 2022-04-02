import { validate, ValidatorOptions } from 'class-validator';

// For some stupid reason, the class-validator library does not have a way to set global defaults
// So now we have to do it this way

export const ValidateOptions: ValidatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  stopAtFirstError: true,
  whitelist: true,
  strictGroups: true,
};

export const strictValidate = (object: object) =>
  validate(object, ValidateOptions);
