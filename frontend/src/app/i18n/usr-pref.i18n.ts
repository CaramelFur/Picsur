import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.enum';

export const UsrPreferenceFriendlyNames: {
  [key in UsrPreference]: string;
} = {
  [UsrPreference.KeepOriginal]: 'Keep original file',
};

export const UsrPreferenceHelpText: {
  [key in UsrPreference]: string;
} = {
  [UsrPreference.KeepOriginal]:
    'Store the original files you upload to the service, this way no data will be lost. This will also store exif data.',
};
