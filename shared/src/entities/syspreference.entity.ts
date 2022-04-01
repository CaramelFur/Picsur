import { IsNotEmpty, IsString } from 'class-validator';
import { EntityIDOptional } from '../validators/entity-id.validator';

export class ESysPreference {
  @EntityIDOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
