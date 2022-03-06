import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SysPreferenceModule } from '../../../collections/syspreferencesdb/syspreferencedb.module';
import { UsersModule } from '../../../collections/userdb/userdb.module';
import { AuthConfigService } from '../../../config/auth.config.service';
import { JwtConfigService, JwtSecretProvider } from '../../../config/jwt.lateconfig.service';
import { PicsurLateConfigModule } from '../../../config/lateconfig.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthStrategy } from './localauth.strategy';


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
    AuthService,
    LocalAuthStrategy,
    JwtStrategy,
    JwtSecretProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger('AuthModule');

  constructor(
    private authService: AuthService,
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
