import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SysPreferenceModule } from '../../collections/syspreferencesdb/syspreferencedb.module';
import { UsersModule } from '../../collections/userdb/userdb.module';
import {
  JwtConfigService,
  JwtSecretProvider
} from '../../config/jwt.lateconfig.service';
import { PicsurLateConfigModule } from '../../config/lateconfig.module';
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
    PicsurLateConfigModule,
    JwtModule.registerAsync({
      useExisting: JwtConfigService,
      imports: [PicsurLateConfigModule],
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
