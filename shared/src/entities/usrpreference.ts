import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { EntityID } from '../validators/entity-id.validator';
import { IsPosInt } from '../validators/positive-int.validator';

export class EUsrPreference {
  @EntityID()
  id?: number;

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
