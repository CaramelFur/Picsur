import {
  SysPreference,
  SysPrefValueTypeStrings
} from 'picsur-shared/dist/dto/syspreferences.dto';

export type SysPreferences = SysPreference[];
export const SysPreferenceList: string[] = Object.values(SysPreference);

// Syspref Values

export const SysPreferenceValueTypes: {
  [key in SysPreference]: SysPrefValueTypeStrings;
} = {
  [SysPreference.JwtSecret]: 'string',
  [SysPreference.JwtExpiresIn]: 'string',
  [SysPreference.TestString]: 'string',
  [SysPreference.TestNumber]: 'number',
  [SysPreference.TestBoolean]: 'boolean',
};
