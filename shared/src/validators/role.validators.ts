import { z } from 'zod';
import { AlphaNumeric } from '../util/common-regex';

export const IsRoleName = () => z.string().min(4).max(32).regex(AlphaNumeric);
