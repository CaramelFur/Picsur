import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SysPreferences } from '../dto/syspreferences.dto';
import { EntityID } from '../validators/entity-id.validator';

export class ESysPreference {
  @EntityID()
  id?: number;

  @IsNotEmpty()
  @IsEnum(SysPreferences)
  key: SysPreferences;

  @IsNotEmpty()
  @IsString()
  value: string;
}
