import { UsrPreference } from 'picsur-shared/dist/dto/usrpreferences.dto';

export const UsrPreferenceFriendlyNames: {
  [key in UsrPreference]: string;
} = {
  [UsrPreference.ExifStripping]: 'EXIF data stripping',
};
