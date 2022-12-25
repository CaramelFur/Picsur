import { PrefValueTypeStrings } from './preferences.dto';

// This enum is only here to make accessing the values easier, and type checking in the backend
export enum UsrPreference {
  KeepOriginal = 'keep_original',
}

export type UsrPreferences = UsrPreference[];
export const UsrPreferenceList: string[] = Object.values(UsrPreference);

// Syspref Value types
export const UsrPreferenceValueTypes: {
  [key in UsrPreference]: PrefValueTypeStrings;
} = {
  [UsrPreference.KeepOriginal]: 'boolean',
};

export const UsrPreferenceValidators: {
  [key in UsrPreference]: (value: any) => boolean;
} = {
  [UsrPreference.KeepOriginal]: (value: any) => typeof value === 'boolean',
};
