import { Injectable, Logger } from '@nestjs/common';
import { PrefValueType } from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.enum';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { EarlyJwtConfigService } from '../../config/early/early-jwt.config.service.js';

// This specific service holds the default values for system and user preferences
// It needs to be in a service because the values depend on the environment
// This environment is not loaded outside of services

@Injectable()
export class PreferenceDefaultsService {
  private readonly logger = new Logger(PreferenceDefaultsService.name);

  constructor(private readonly jwtConfigService: EarlyJwtConfigService) {}

  private readonly usrDefaults: {
    [key in UsrPreference]: (() => PrefValueType) | PrefValueType;
  } = {
    [UsrPreference.KeepOriginal]: false,
  };

  private readonly sysDefaults: {
    [key in SysPreference]: (() => PrefValueType) | PrefValueType;
  } = {
    [SysPreference.HostOverride]: '',

    [SysPreference.JwtSecret]: () => {
      const envSecret = this.jwtConfigService.getJwtSecret();
      if (envSecret) {
        return envSecret;
      } else {
        this.logger.log(
          'Since no JWT secret was provided, a random one will be generated and saved',
        );
        return generateRandomString(64);
      }
    },
    [SysPreference.JwtExpiresIn]: () =>
      this.jwtConfigService.getJwtExpiresIn() ?? '7d',
    [SysPreference.BCryptStrength]: 10,

    [SysPreference.RemoveDerivativesAfter]: '7d',
    [SysPreference.AllowEditing]: true,

    [SysPreference.ConversionTimeLimit]: '15s',
    [SysPreference.ConversionMemoryLimit]: 512,

    [SysPreference.EnableTracking]: false,
    [SysPreference.TrackingUrl]: '',
    [SysPreference.TrackingId]: '',

    [SysPreference.EnableTelemetry]: true,
  };

  public getSysDefault(pref: SysPreference): PrefValueType {
    const value = this.sysDefaults[pref];
    if (typeof value === 'function') {
      return value();
    } else {
      return value;
    }
  }

  public getUsrDefault(pref: UsrPreference): PrefValueType {
    const value = this.usrDefaults[pref];
    if (typeof value === 'function') {
      return value();
    } else {
      return value;
    }
  }
}
