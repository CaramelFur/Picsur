import { IsOptional, IsString } from 'class-validator';
import { IsEntityID } from '../validators/entity-id.validator';

export class ESysPreference {
  @IsOptional()
  @IsEntityID()
  id?: string;

  @IsString()
  key: string;

  @IsString()
  value: string;
}
