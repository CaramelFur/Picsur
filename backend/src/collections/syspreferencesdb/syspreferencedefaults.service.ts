import { Injectable, Logger } from '@nestjs/common';
import {
  SysPreference,
  SysPrefValueType
} from 'picsur-shared/dist/dto/syspreferences.dto';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { EarlyJwtConfigService } from '../../config/early/earlyjwt.config.service';

// This specific service is used to store default values for system preferences
// It needs to be in a service because the values depend on the environment

@Injectable()
export class SysPreferenceDefaultsService {
  private readonly logger = new Logger('SysPreferenceDefaultsService');

  constructor(private jwtConfigService: EarlyJwtConfigService) {}

  public readonly defaults: {
    [key in SysPreference]: () => SysPrefValueType;
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
