import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyDbModule } from '../../collections/apikey-db/apikey-db.module';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module';
import { UserDbModule } from '../../collections/user-db/user-db.module';
import {
  JwtConfigService,
  JwtSecretProvider,
} from '../../config/late/jwt.config.service';
import { LateConfigModule } from '../../config/late/late-config.module';
import { AuthManagerService } from './auth.service';
import { ApiKeyStrategy } from './guards/apikey.strategy';
import { GuestStrategy } from './guards/guest.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalAuthStrategy } from './guards/local-auth.strategy';
import { MainAuthGuard } from './guards/main.guard';
import { GuestService } from './guest.service';

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
