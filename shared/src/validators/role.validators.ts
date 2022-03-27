import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { CombinePDecorators } from '../util/decorator';

export const IsRoleName = CombinePDecorators(
  IsNotEmpty(),
  IsString(),
  Length(4, 32),
  IsAlphanumeric(),
);
