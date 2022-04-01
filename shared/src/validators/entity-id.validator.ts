import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const EntityID = CombinePDecorators(IsOptional(), IsUUID('4'));
export const EntityIDRequired = CombinePDecorators(IsNotEmpty(), IsUUID('4'));
