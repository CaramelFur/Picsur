import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';
import tuple from '../types/tuple';

// Syspref keys

const SysPreferencesTuple = tuple(
  'jwt_secret',
  'jwt_expires_in',
  'upload_require_auth',
  'test_string',
  'test_number',
  'test_boolean',
);

export const SysPreferences: string[] = SysPreferencesTuple;
export type SysPreferences = typeof SysPreferencesTuple[number];

// Syspref Values

export type SysPrefValueType = string | number | boolean;
export type SysPrefValueTypeStrings = 'string' | 'number' | 'boolean';
export const SysPrefValueTypes = ['string', 'number', 'boolean'];

export const SysPreferenceValueTypes: {
  [key in SysPreferences]: SysPrefValueTypeStrings;
} = {
  jwt_secret: 'string',
  jwt_expires_in: 'string',
  upload_require_auth: 'boolean',
  test_string: 'string',
  test_number: 'number',
  test_boolean: 'boolean',
};

// Validators

export function isSysPrefValue(value: any, args: ValidationArguments) {
  const type = typeof value;
  return SysPrefValueTypes.includes(type);
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

// interfaces

export interface InternalSysprefRepresentation {
  value: SysPrefValueType;
  type: SysPrefValueTypeStrings;
}
