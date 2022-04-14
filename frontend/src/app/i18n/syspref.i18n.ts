import { SysPreference } from 'picsur-shared/dist/dto/syspreferences.dto';

export const SysPreferenceFriendlyNames: {
  [key in SysPreference]: string;
} = {
  [SysPreference.JwtSecret]: 'JWT Secret',
  [SysPreference.JwtExpiresIn]: 'JWT Expiry Time',
  [SysPreference.BCryptStrength]: 'BCrypt Strength',
};
