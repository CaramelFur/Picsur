import { IsInt, Min } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsPosInt = CombinePDecorators(IsInt(), Min(0));
