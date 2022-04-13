import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SysPreferenceModule } from '../../collections/preferencesdb/preferencedb.module';
import { UsersModule } from '../../collections/userdb/userdb.module';
import { JwtConfigService, JwtSecretProvider } from '../../config/late/jwt.config.service';
import { LateConfigModule } from '../../config/late/lateconfig.module';
import { AuthManagerService } from './auth.service';
import { GuestStrategy } from './guards/guest.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalAuthStrategy } from './guards/localauth.strategy';
import { GuestService } from './guest.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SysPreferenceModule,
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
  exports: [UsersModule, AuthManagerService],
})
export class AuthManagerModule {}
