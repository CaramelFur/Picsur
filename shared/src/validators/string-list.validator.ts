import {
  IsArray,
  IsNotEmpty,
  IsString
} from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsStringList = CombinePDecorators(
  IsArray(),
  IsString({ each: true }),
  IsNotEmpty({ each: true }),
);
