import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SysPreferenceModule } from '../../collections/syspreferencesdb/syspreferencedb.module';
import { UsersModule } from '../../collections/userdb/userdb.module';
import { AuthConfigService } from '../../config/auth.config.service';
import {
  JwtConfigService,
  JwtSecretProvider
} from '../../config/jwt.lateconfig.service';
import { PicsurLateConfigModule } from '../../config/lateconfig.module';
import { AuthManagerService } from './auth.service';
import { GuestStrategy } from './guards/guest.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalAuthStrategy } from './guards/localauth.strategy';

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
  ],
  exports: [AuthManagerService],
})
export class AuthManagerModule implements OnModuleInit {
  private readonly logger = new Logger('AuthModule');

  constructor(
    private authService: AuthManagerService,
    private authConfigService: AuthConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminExists();
  }

  private async ensureAdminExists() {
    const username = this.authConfigService.getDefaultAdminUsername();
    const password = this.authConfigService.getDefaultAdminPassword();
    this.logger.debug(`Ensuring admin user "${username}" exists`);

    await this.authService.createUser(username, password);
    await this.authService.makeAdmin(username);
  }
}
