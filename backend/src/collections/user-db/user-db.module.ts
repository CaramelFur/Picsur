import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasFailed } from 'picsur-shared/dist/types';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { AuthConfigService } from '../../config/early/auth.config.service';
import { EarlyConfigModule } from '../../config/early/early-config.module';
import { EUserBackend } from '../../database/entities/user.entity';
import { PreferenceDbModule } from '../preference-db/preference-db.module';
import { RoleDbModule } from '../role-db/role-db.module';
import { UserDbService } from './user-db.service';

@Module({
  imports: [
    EarlyConfigModule,
    RoleDbModule,
    PreferenceDbModule,
    TypeOrmModule.forFeature([EUserBackend]),
  ],
  providers: [UserDbService],
  exports: [UserDbService],
})
export class UserDbModule implements OnModuleInit {
  private readonly logger = new Logger(UserDbModule.name);

  constructor(
    private readonly usersService: UserDbService,
    private readonly authConfigService: AuthConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureUserExists(
      'guest',
      // Guest should never be able to login
      // It should be prevented even if you know the password
      // But to be sure, we set it to a random string
      generateRandomString(128),
      ['guest'],
    );
    await this.ensureUserExists(
      'admin',
      this.authConfigService.getDefaultAdminPassword(),
      ['user', 'admin'],
    );
  }

  private async ensureUserExists(
    username: string,
    password: string,
    roles: string[],
  ) {
    this.logger.verbose(`Ensuring user "${username}" exists`);

    const exists = await this.usersService.exists(username);
    if (exists) return;

    const newUser = await this.usersService.create(
      username,
      password,
      roles,
      true,
    );
    if (HasFailed(newUser)) {
      this.logger.error(
        `Failed to create user "${username}" because: ${newUser.getReason()}`,
      );
      return;
    }
  }
}
