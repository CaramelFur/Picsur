import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { PrefValueTypes } from '../dto/preferences.dto';

export function isSysPrefValue(value: any, args: ValidationArguments) {
  const type = typeof value;
  return PrefValueTypes.includes(type);
}

export function IsSysPrefValue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSysPrefValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: isSysPrefValue,
      },
    });
  };
}
