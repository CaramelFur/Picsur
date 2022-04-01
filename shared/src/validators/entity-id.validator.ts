import { IsNotEmpty, IsUUID } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const EntityID = CombinePDecorators(IsNotEmpty(), IsUUID('4'));
