import { z } from 'zod';
import { AlphaNumeric } from '../util/common-regex';

// Match this with user validators in frontend
// (Frontend is not security focused, but it tells the user what is wrong)

export const IsUsername = () => z.string().min(4).max(32).regex(AlphaNumeric);

export const IsPlainTextPwd = () => z.string().min(4).max(1024);
