import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const EntityID = CombinePDecorators(IsNotEmpty(), IsUUID('4'));
export const EntityIDOptional = CombinePDecorators(IsOptional(), IsUUID('4'));
