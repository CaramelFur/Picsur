import { UsrPreference } from 'picsur-shared/dist/dto/usrpreferences.dto';

export const UsrPreferenceFriendlyNames: {
  [key in UsrPreference]: string;
} = {
  [UsrPreference.TestString]: 'Test String',
  [UsrPreference.TestNumber]: 'Test Number',
  [UsrPreference.TestBoolean]: 'Test Boolean',
};
