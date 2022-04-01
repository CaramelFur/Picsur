import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { EntityIDOptional } from '../validators/entity-id.validator';
import { IsPosInt } from '../validators/positive-int.validator';

export class EUsrPreference {
  @EntityIDOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsDefined()
  @IsPosInt()
  userId: number;
}
