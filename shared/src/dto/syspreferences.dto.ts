export enum SysPreference {
  JwtSecret = 'jwt_secret',
  JwtExpiresIn = 'jwt_expires_in',
  TestString = 'test_string',
  TestNumber = 'test_number',
  TestBoolean = 'test_boolean',
}

// Variable value type
export type SysPrefValueType = string | number | boolean;
export type SysPrefValueTypeStrings = 'string' | 'number' | 'boolean';
export const SysPrefValueTypes = ['string', 'number', 'boolean'];

// Interfaces
export interface InternalSysprefRepresentation {
  key: string;
  value: SysPrefValueType;
  type: SysPrefValueTypeStrings;
}
