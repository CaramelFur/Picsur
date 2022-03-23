import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasFailed } from 'picsur-shared/dist/types';
import { generateRandomString } from 'picsur-shared/dist/util/random';
import { AuthConfigService } from '../../config/auth.config.service';
import { PicsurConfigModule } from '../../config/config.module';
import { EUserBackend } from '../../models/entities/user.entity';
import { RolesModule } from '../roledb/roledb.module';
import { UsersService } from './userdb.service';
import { UserRolesService } from './userrolesdb.service';

@Module({
  imports: [
    PicsurConfigModule,
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
    await this.ensureGuestExists();
    await this.ensureAdminExists();
  }

  private async ensureGuestExists() {
    const username = 'guest';
    const password = generateRandomString(128);
    this.logger.debug(`Ensuring guest user exists`);

    const exists = await this.usersService.exists(username);
    if (exists) return;

    const newUser = await this.usersService.create(
      username,
      password,
      ['guest'],
      true,
    );
    if (HasFailed(newUser)) {
      this.logger.error(
        `Failed to create guest user because: ${newUser.getReason()}`,
      );
      return;
    }
  }

  private async ensureAdminExists() {
    const username = 'admin';
    const password = this.authConfigService.getDefaultAdminPassword();
    this.logger.debug(`Ensuring admin user exists`);

    const exists = await this.usersService.exists(username);
    if (exists) return;

    const newUser = await this.usersService.create(
      username,
      password,
      ['user', 'admin'],
      true,
    );
    if (HasFailed(newUser)) {
      this.logger.error(
        `Failed to create admin user because: ${newUser.getReason()}`,
      );
      return;
    }
  }
}
