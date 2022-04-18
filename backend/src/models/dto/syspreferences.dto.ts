import { PrefValueTypeStrings } from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.dto';

export type SysPreferences = SysPreference[];
export const SysPreferenceList: string[] = Object.values(SysPreference);

// Syspref Value types
export const SysPreferenceValueTypes: {
  [key in SysPreference]: PrefValueTypeStrings;
} = {
  [SysPreference.JwtSecret]: 'string',
  [SysPreference.JwtExpiresIn]: 'string',
  [SysPreference.BCryptStrength]: 'number',
};
