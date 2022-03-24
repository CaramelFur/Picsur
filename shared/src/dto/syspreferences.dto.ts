import tuple from '../types/tuple';

// Syspref keys

const SysPreferencesTuple = tuple(
  'jwt_secret',
  'jwt_expires_in',
  'test_string',
  'test_number',
  'test_boolean',
);

export const SysPreferences: string[] = SysPreferencesTuple;
export type SysPreferences = typeof SysPreferencesTuple[number];

export const SysPreferenceFriendlyNames: {
  [key in SysPreferences]: string;
} = {
  jwt_secret: 'JWT Secret',
  jwt_expires_in: 'JWT Expiry Time',
  test_string: 'Test String',
  test_number: 'Test Number',
  test_boolean: 'Test Boolean',
};

// Syspref Values

export type SysPrefValueType = string | number | boolean;
export type SysPrefValueTypeStrings = 'string' | 'number' | 'boolean';
export const SysPrefValueTypes = ['string', 'number', 'boolean'];

export const SysPreferenceValueTypes: {
  [key in SysPreferences]: SysPrefValueTypeStrings;
} = {
  jwt_secret: 'string',
  jwt_expires_in: 'string',
  test_string: 'string',
  test_number: 'number',
  test_boolean: 'boolean',
};

// Validators


// interfaces

export interface InternalSysprefRepresentation {
  key: SysPreferences;
  value: SysPrefValueType;
  type: SysPrefValueTypeStrings;
}
