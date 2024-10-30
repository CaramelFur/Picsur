import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyDbModule } from '../../collections/apikey-db/apikey-db.module.js';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module.js';
import { UserDbModule } from '../../collections/user-db/user-db.module.js';
import {
    JwtConfigService,
    JwtSecretProvider,
} from '../../config/late/jwt.config.service.js';
import { LateConfigModule } from '../../config/late/late-config.module.js';
import { AuthManagerService } from './auth.service.js';
import { ApiKeyStrategy } from './guards/apikey.strategy.js';
import { GuestStrategy } from './guards/guest.strategy.js';
import { JwtStrategy } from './guards/jwt.strategy.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { LocalAuthStrategy } from './guards/local-auth.strategy.js';
import { MainAuthGuard } from './guards/main.guard.js';
import { GuestService } from './guest.service.js';

@Module({
  imports: [
    UserDbModule,
    PassportModule,
    PreferenceDbModule,
    ApiKeyDbModule,
    LateConfigModule,
    JwtModule.registerAsync({
      useExisting: JwtConfigService,
      imports: [LateConfigModule],
    }),
  ],
  providers: [
    AuthManagerService,
    GuestService,
    JwtSecretProvider,
    LocalAuthStrategy,
    JwtStrategy,
    GuestStrategy,
    ApiKeyStrategy,
    LocalAuthGuard,
    MainAuthGuard,
  ],
  exports: [UserDbModule, AuthManagerService, LocalAuthGuard, MainAuthGuard],
})
export class AuthManagerModule {}
