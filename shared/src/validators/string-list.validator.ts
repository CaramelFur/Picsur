import {
  IsArray, IsString
} from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsStringList = CombinePDecorators(
  IsArray(),
  IsString({ each: true }),
);
