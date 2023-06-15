import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { UIFriendlyPermissions } from '../../../../i18n/permissions.i18n';
import { UpdateUserControl } from '../../../../models/forms/update-user.control';
import { RolesService } from '../../../../services/api/roles.service';
import { StaticInfoService } from '../../../../services/api/static-info.service';
import { UserAdminService } from '../../../../services/api/user-manage.service';
import { Logger } from '../../../../services/logger/logger.service';
import { ErrorService } from '../../../../util/error-manager/error.service';

enum EditMode {
  edit = 'edit',
  add = 'add',
}

@Component({
  selector: 'app-settings-users-edit',
  templateUrl: './settings-users-edit.component.html',
  styleUrls: ['./settings-users-edit.component.scss'],
})
export class SettingsUsersEditComponent implements OnInit {
  private readonly logger = new Logger(SettingsUsersEditComponent.name);

  private ImmutableUsersList: string[] = [];
  private mode: EditMode = EditMode.edit;

  model = new UpdateUserControl();
  allFullRoles: ERole[] = [];
  get allRoles(): string[] {
    return this.allFullRoles.map((role) => role.name);
  }
  soulBoundRoles: string[] = [];

  get adding() {
    return this.mode === EditMode.add;
  }
  get editing() {
    return this.mode === EditMode.edit;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userManageService: UserAdminService,
    private readonly rolesService: RolesService,
    private readonly staticInfo: StaticInfoService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit() {
    Promise.all([
      this.initUser(),
      this.initRoles(),
      this.initImmutableUsersList(),
    ]).catch(this.logger.error);
  }

  private async initUser() {
    const uuid = this.route.snapshot.paramMap.get('uuid');

    // Get special roles
    const SpecialRoles = await this.staticInfo.getSpecialRoles();
    this.soulBoundRoles = SpecialRoles.SoulBoundRoles;

    // Check if edit or add
    if (!uuid) {
      this.mode = EditMode.add;

      this.model.putRoles(SpecialRoles.DefaultRoles);
      return;
    }

    // Set known data
    this.mode = EditMode.edit;
    this.model.putId(uuid);

    // Fetch more data
    const user = await this.userManageService.getUser(uuid);
    if (HasFailed(user))
      return this.errorService.showFailure(user, this.logger);

    // Set that data instead
    this.model.putUsername(user.username);
    this.model.putRoles(user.roles);
  }

  private async initImmutableUsersList() {
    const SpecialUsers = await this.staticInfo.getSpecialUsers();
    this.ImmutableUsersList = SpecialUsers.ImmutableUsersList;
  }

  private async initRoles() {
    const roles = await this.rolesService.getRoles();
    if (HasFailed(roles))
      return this.errorService.showFailure(roles, this.logger);

    this.allFullRoles = roles;
  }

  public getEffectivePermissions(): string[] {
    const permissions: string[] = [];

    for (const role of this.model.selectedRoles) {
      const fullRole = this.allFullRoles.find((r) => r.name === role);
      if (!fullRole) {
        this.logger.warn(`Role ${role} not found`);
        continue;
      }

      permissions.push(
        ...fullRole.permissions.filter((p) => !permissions.includes(p)),
      );
    }

    return permissions.map((p) => UIFriendlyPermissions[p as Permission] ?? p);
  }

  cancel() {
    this.router.navigate(['/settings/users']);
  }

  async updateUser() {
    if (this.adding) {
      const data = this.model.getDataCreate();
      const resultUser = await this.userManageService.createUser(data);
      if (HasFailed(resultUser))
        return this.errorService.showFailure(resultUser, this.logger);

      this.errorService.success('User created');
    } else {
      const data = this.model.getDataUpdate();
      if (!data.password) delete data.password;

      const resultUser = await this.userManageService.updateUser(data);
      if (HasFailed(resultUser))
        return this.errorService.showFailure(resultUser, this.logger);

      this.errorService.success('User updated');
    }

    this.router.navigate(['/settings/users']);
  }

  isLockedPerms(): boolean {
    if (this.adding) {
      return false;
    } else {
      return this.ImmutableUsersList.includes(
        this.model.getDataCreate().username,
      );
    }
  }
}
