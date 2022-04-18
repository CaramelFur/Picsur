import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.dto';

export const UsrPreferenceFriendlyNames: {
  [key in UsrPreference]: string;
} = {
  [UsrPreference.KeepOriginal]: 'Keep original file',
};
