import { IsNotEmpty } from 'class-validator';
import tuple from '../types/tuple';

const SysPreferencesTuple = tuple(
  'jwt_secret',
  'jwt_expires_in',
  'upload_require_auth',
);

export const SysPreferences: string[] = SysPreferencesTuple;
export type SysPreferences = typeof SysPreferencesTuple[number];

export class UpdateSysPreferenceRequest {
  @IsNotEmpty()
  value: string;
}
