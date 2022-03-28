import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasFailed } from 'picsur-shared/dist/types';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { AuthConfigService } from '../../config/early/auth.config.service';
import { EarlyConfigModule } from '../../config/early/earlyconfig.module';
import { EUserBackend } from '../../models/entities/user.entity';
import { RolesModule } from '../roledb/roledb.module';
import { UsersService } from './userdb.service';
import { UserRolesService } from './userrolesdb.service';

@Module({
  imports: [
    EarlyConfigModule,
    RolesModule,
    TypeOrmModule.forFeature([EUserBackend]),
  ],
  providers: [UsersService, UserRolesService],
  exports: [UsersService, UserRolesService],
})
export class UsersModule implements OnModuleInit {
  private readonly logger = new Logger('UsersModule');

  constructor(
    private usersService: UsersService,
    private userRolesService: UserRolesService,
    private authConfigService: AuthConfigService,
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
    this.logger.debug(`Ensuring user "${username}" exists`);

    const exists = await this.usersService.exists(username);
    if (exists) return;

    const newUser = await this.usersService.create(
      username,
      password,
      roles,
      false,
    );
    if (HasFailed(newUser)) {
      this.logger.error(
        `Failed to create user "${username}" because: ${newUser.getReason()}`,
      );
      return;
    }
  }
}
