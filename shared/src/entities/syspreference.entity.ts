import { IsNotEmpty, IsString } from 'class-validator';
import { EntityID } from '../validators/entity-id.validator';

export class ESysPreference {
  @EntityID()
  id?: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
