import { SysPreferences } from 'picsur-shared/dist/dto/syspreferences.dto';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import Config from '../../env';

export const SysPreferenceDefaults: {
  [key in SysPreferences]: () => string;
} = {
  jwt_secret: () => {
    if (Config.jwt.secret !== 'CHANGE_ME') return Config.jwt.secret;
    return generateRandomString(32);
  },
};
