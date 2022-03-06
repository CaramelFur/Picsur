import { generateRandomString } from '../util/random';
import tuple from '../types/tuple';
import { randomBytes } from 'crypto';
import { IsNotEmpty } from 'class-validator';

const SysPreferencesTuple = tuple('jwt_secret', 'jwt_expires_in');

export const SysPreferences: string[] = SysPreferencesTuple;
export type SysPreferences = typeof SysPreferencesTuple[number];

export class UpdateSysPreferenceRequest {
  @IsNotEmpty()
  value: string;
}
