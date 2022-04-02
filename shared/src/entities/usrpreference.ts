import { IsOptional, IsString } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsPosInt } from '../validators/positive-int.validator';

export class EUsrPreference {
  @IsOptional()
  @IsEntityID()
  id?: string;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsPosInt()
  userId: number;
}
