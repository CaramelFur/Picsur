import { IsNotEmpty } from 'class-validator';
import { ESysPreference } from '../../entities/syspreference.entity';

export class UpdateSysPreferenceRequest {
  @IsNotEmpty()
  value: string;
}

export class SysPreferenceResponse extends ESysPreference {}
