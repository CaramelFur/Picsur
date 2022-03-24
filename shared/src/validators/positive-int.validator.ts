import { IsDefined, IsInt, Min } from 'class-validator';
import { ComposeValidators } from './compose.validator';

export const IsPosInt = ComposeValidators(IsInt(), Min(0), IsDefined());
