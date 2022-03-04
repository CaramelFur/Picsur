import { generateRandomString } from '../util/random';
import tuple from '../types/tuple';
import { randomBytes } from 'crypto';

const SysPreferencesTuple = tuple('jwt_secret');

export const SysPreferences: string[] = SysPreferencesTuple;
export type SysPreferences = typeof SysPreferencesTuple[number];
