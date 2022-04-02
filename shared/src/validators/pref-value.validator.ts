import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { PrefValueTypes } from '../dto/preferences.dto';

export function isPrefValue(value: any, args: ValidationArguments) {
  const type = typeof value;
  return PrefValueTypes.includes(type);
}

export function IsPrefValue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPrefValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ?? {},
      validator: {
        validate: isPrefValue,
      },
    });
  };
}
