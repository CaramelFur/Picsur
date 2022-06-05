import { z } from 'zod';
import { AlphaNumericRegex } from '../util/common-regex';

export const IsRoleName = () =>
  z.string().min(4).max(32).regex(AlphaNumericRegex);
