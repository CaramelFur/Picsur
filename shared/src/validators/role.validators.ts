import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsRoleName = CombinePDecorators(
  IsString(),
  Length(4, 32),
  IsAlphanumeric(),
);
