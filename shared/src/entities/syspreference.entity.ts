import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SysPreferences } from '../dto/syspreferences.dto';

export class ESysPreference {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsEnum(SysPreferences)
  key: SysPreferences;

  @IsNotEmpty()
  @IsString()
  value: string;
}
