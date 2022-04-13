import { Injectable, Logger } from '@nestjs/common';
import { PrefValueType } from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/syspreferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usrpreferences.dto';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { EarlyJwtConfigService } from '../../config/early/earlyjwt.config.service';

// This specific service is used to store default values for system preferences
// It needs to be in a service because the values depend on the environment

@Injectable()
export class PreferenceDefaultsService {
  private readonly logger = new Logger('PreferenceDefaultsService');

  constructor(private jwtConfigService: EarlyJwtConfigService) {}

  public readonly usrDefaults: {
    [key in UsrPreference]: () => PrefValueType;
  } = {
    [UsrPreference.TestString]: () => 'test_string',
    [UsrPreference.TestNumber]: () => 123,
    [UsrPreference.TestBoolean]: () => true,
  };

  public readonly sysDefaults: {
    [key in SysPreference]: () => PrefValueType;
  } = {
    [SysPreference.JwtSecret]: () => {
      const envSecret = this.jwtConfigService.getJwtSecret();
      if (envSecret) {
        return envSecret;
      } else {
        this.logger.warn(
          'Since no JWT secret was provided, a random one will be generated and saved',
        );
        return generateRandomString(64);
      }
    },
    [SysPreference.JwtExpiresIn]: () =>
      this.jwtConfigService.getJwtExpiresIn() ?? '7d',
    [SysPreference.BCryptStrength]: () => 12,

    [SysPreference.TestString]: () => 'test_string',
    [SysPreference.TestNumber]: () => 123,
    [SysPreference.TestBoolean]: () => true,
  };
}
