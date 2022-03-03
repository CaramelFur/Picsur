import {
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthStrategy } from './localauth.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../../../collections/userdb/userdb.module';
import Config from '../../../env';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: Config.jwt.secret,
      signOptions: { expiresIn: Config.jwt.expiresIn },
    }),
  ],
  providers: [AuthService, LocalAuthStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger('AuthModule');

  constructor(private authService: AuthService) {}

  onModuleInit() {
    this.checkJwtSecret();
    this.ensureAdminExists();
  }

  private checkJwtSecret() {
    if (Config.jwt.secret === 'CHANGE_ME') {
      this.logger.error(
        "JWT secret is not set. Please set the 'JWT_SECRET' environment variable.",
      );
    }
  }

  private async ensureAdminExists() {
    const admin = Config.defaultAdmin;
    this.logger.debug(`Ensuring admin user ${admin.username} exists`);

    await this.authService.createUser(admin.username, admin.password);
    await this.authService.makeAdmin(admin.username);
  }
}
