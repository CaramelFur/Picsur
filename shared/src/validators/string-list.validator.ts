import {
  IsArray,
  IsNotEmpty,
  IsString
} from 'class-validator';
import { ComposeValidators } from './compose.validator';

export const IsStringList = ComposeValidators(
  IsArray(),
  IsString({ each: true }),
  IsNotEmpty({ each: true }),
);
