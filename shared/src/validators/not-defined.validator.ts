import {
  IsOptional,
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';

export function isNotDefined(value: any, args: ValidationArguments) {
  return value === undefined || value === null;
}

export function IsNotDefined(validationOptions?: ValidationOptions) {
  const optional = IsOptional();
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ?? {},
      validator: {
        validate: isNotDefined,
      },
    });
    optional(object, propertyName);
  };
}
