import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const EntityID = CombinePDecorators(IsOptional(), IsInt(), Min(0));
export const EntityIDRequired = CombinePDecorators(IsNotEmpty(), IsInt(), Min(0));
