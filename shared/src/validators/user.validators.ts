import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { ComposeValidators } from './compose.validator';

// Match this with user validators in frontend
// (Frontend is not security focused, but it tells the user what is wrong)

export const IsUsername = ComposeValidators(
  IsNotEmpty(),
  IsString(),
  Length(4, 32),
  IsAlphanumeric(),
);

export const IsPlainTextPwd = ComposeValidators(
  IsNotEmpty(),
  IsString(),
  Length(4, 1024),
);
