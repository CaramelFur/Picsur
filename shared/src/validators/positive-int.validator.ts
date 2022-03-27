import { IsDefined, IsInt, Min } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsPosInt = CombinePDecorators(IsInt(), Min(0), IsDefined());
