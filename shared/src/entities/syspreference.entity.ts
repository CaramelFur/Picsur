import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SysPreferences } from '../dto/syspreferences.dto';

export class ESysPreference {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsEnum(SysPreferences)
  key: SysPreferences;

  @IsNotEmpty()
  value: string;
}
