import { IsUUID } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsEntityID = CombinePDecorators(IsUUID('4'));
