import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasFailed } from 'picsur-shared/dist/types';
import { AuthConfigService } from '../../config/auth.config.service';
import { PicsurConfigModule } from '../../config/config.module';
import { EUserBackend } from '../../models/entities/user.entity';
import { RolesModule } from '../roledb/roledb.module';
import { UsersService } from './userdb.service';

@Module({
  imports: [
    PicsurConfigModule,
    RolesModule,
    TypeOrmModule.forFeature([EUserBackend]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  private readonly logger = new Logger('UsersModule');

  constructor(
    private usersService: UsersService,
    private authConfigService: AuthConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminExists();
  }

  private async ensureAdminExists() {
    const username = this.authConfigService.getDefaultAdminUsername();
    const password = this.authConfigService.getDefaultAdminPassword();
    this.logger.debug(`Ensuring admin user "${username}" exists`);

    const exists = await this.usersService.exists(username);
    if (exists) return;

    const newUser = await this.usersService.create(username, password);
    if (HasFailed(newUser)) {
      this.logger.error(
        `Failed to create admin user "${username}" because: ${newUser.getReason()}`,
      );
      return;
    }

    const result = await this.usersService.addRoles(newUser, ['admin']);
    if (HasFailed(result)) {
      this.logger.error(
        `Failed to make admin user "${username}" because: ${result.getReason()}`,
      );
      return;
    }
  }
}
