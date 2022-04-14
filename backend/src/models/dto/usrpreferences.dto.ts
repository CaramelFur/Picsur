import { PrefValueTypeStrings } from 'picsur-shared/dist/dto/preferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usrpreferences.dto';

export type UsrPreferences = UsrPreference[];
export const UsrPreferenceList: string[] = Object.values(UsrPreference);

// Syspref Value types
export const UsrPreferenceValueTypes: {
  [key in UsrPreference]: PrefValueTypeStrings;
} = {
  [UsrPreference.ExifStripping]: 'boolean',
};
