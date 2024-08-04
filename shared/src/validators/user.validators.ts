import { z } from 'zod';
import { AlphaNumericRegex } from '../util/common-regex.js';

// Match this with user validators in frontend
// (Frontend is not security focused, but it tells the user what is wrong)

export const IsUsername = () =>
  z.string().min(4).max(32).regex(AlphaNumericRegex);

export const IsPlainTextPwd = () => z.string().min(4).max(1024);
