import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module';
import { UserDbModule } from '../../collections/user-db/user-db.module';
import {
  JwtConfigService,
  JwtSecretProvider
} from '../../config/late/jwt.config.service';
import { LateConfigModule } from '../../config/late/late-config.module';
import { AuthManagerService } from './auth.service';
import { GuestStrategy } from './guards/guest.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalAuthStrategy } from './guards/local-auth.strategy';
import { GuestService } from './guest.service';

@Module({
  imports: [
    UserDbModule,
    PassportModule,
    PreferenceDbModule,
    LateConfigModule,
    JwtModule.registerAsync({
      useExisting: JwtConfigService,
      imports: [LateConfigModule],
    }),
  ],
  providers: [
    AuthManagerService,
    LocalAuthStrategy,
    JwtStrategy,
    GuestStrategy,
    JwtSecretProvider,
    GuestService,
  ],
  exports: [UserDbModule, AuthManagerService],
})
export class AuthManagerModule {}
