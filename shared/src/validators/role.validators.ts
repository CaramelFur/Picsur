import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { ComposeValidators } from './compose.validator';

export const IsRoleName = ComposeValidators(
  IsNotEmpty(),
  IsString(),
  Length(4, 32),
  IsAlphanumeric(),
);
