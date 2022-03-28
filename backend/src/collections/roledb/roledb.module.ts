import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasFailed } from 'picsur-shared/dist/types';
import { EarlyConfigModule } from '../../config/early/earlyconfig.module';
import { HostConfigService } from '../../config/early/host.config.service';
import { ImmutableRolesList, SystemRoleDefaults, UndeletableRolesList } from '../../models/dto/roles.dto';
import { ERoleBackend } from '../../models/entities/role.entity';
import { RolesService } from './roledb.service';

@Module({
  imports: [EarlyConfigModule, TypeOrmModule.forFeature([ERoleBackend])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule implements OnModuleInit {
  private readonly logger = new Logger('RolesModule');

  constructor(
    private rolesService: RolesService,
    private hostConfig: HostConfigService,
  ) {}

  async onModuleInit() {
    // Nuking roles in dev environment makes testing easier
    // This ensures that the roles are always started with their default permissions
    if (!this.hostConfig.isProduction()) {
      await this.nukeRoles();
    }

    await this.ensureSystemRolesExist();
    await this.updateImmutableRoles();
  }

  private async nukeRoles() {
    this.logger.error('Nuking system roles');
    const result = await this.rolesService.nukeSystemRoles(true);
    if (HasFailed(result)) {
      this.logger.error(`Failed to nuke roles because: ${result.getReason()}`);
    }
  }

  private async ensureSystemRolesExist() {
    // The UndeletableRolesList is also the list of systemroles
    for (const systemRole of UndeletableRolesList) {
      this.logger.debug(`Ensuring system role "${systemRole}" exists`);

      const exists = await this.rolesService.exists(systemRole);
      if (exists) continue;

      const newRole = await this.rolesService.create(
        systemRole,
        SystemRoleDefaults[systemRole],
      );
      if (HasFailed(newRole)) {
        this.logger.error(
          `Failed to create system role "${systemRole}" because: ${newRole.getReason()}`,
        );
        continue;
      }
    }
  }

  private async updateImmutableRoles() {
    // Immutable roles can not be updated via the gui
    // They therefore do have to be kept up to date from the backend
    
    for (const immutableRole of ImmutableRolesList) {
      this.logger.debug(
        `Updating permissions for immutable role "${immutableRole}"`,
      );

      const result = await this.rolesService.setPermissions(
        immutableRole,
        SystemRoleDefaults[immutableRole],
        true,
      );
      if (HasFailed(result)) {
        this.logger.error(
          `Failed to update permissions for immutable role "${immutableRole}" because: ${result.getReason()}`,
        );
        continue;
      }
    }
  }
}
