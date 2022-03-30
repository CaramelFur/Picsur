import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { UIFriendlyPermissions } from 'src/app/i18n/permissions.i18n';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UpdateUserControl } from 'src/app/models/forms/updateuser.control';
import { RolesService } from 'src/app/services/api/roles.service';
import { StaticInfoService } from 'src/app/services/api/static-info.service';
import { UserManageService } from 'src/app/services/api/usermanage.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { UtilService } from 'src/app/util/util.service';

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
  private readonly logger = new Logger('SettingsUsersEditComponent');

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
    private route: ActivatedRoute,
    private router: Router,
    private userManageService: UserManageService,
    private utilService: UtilService,
    private rolesService: RolesService,
    private staticInfo: StaticInfoService
  ) {}

  ngOnInit() {
    Promise.all([
      this.initUser(),
      this.initRoles(),
      this.initImmutableUsersList(),
    ]).catch(this.logger.error);
  }

  private async initUser() {
    const username = this.route.snapshot.paramMap.get('username');

    // Get special roles
    const SpecialRoles = await this.staticInfo.getSpecialRoles();
    this.soulBoundRoles = SpecialRoles.SoulBoundRoles;

    // Check if edit or add
    if (!username) {
      this.mode = EditMode.add;

      this.model.putRoles(SpecialRoles.DefaultRoles);
      return;
    }

    // Set known data
    this.mode = EditMode.edit;
    this.model.putUsername(username);

    // Fetch more data
    const user = await this.userManageService.getUser(username);
    if (HasFailed(user)) {
      this.utilService.showSnackBar('Failed to get user', SnackBarType.Error);
      return;
    }

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
    if (HasFailed(roles)) {
      this.utilService.showSnackBar('Failed to get roles', SnackBarType.Error);
      return;
    }

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
        ...fullRole.permissions.filter((p) => !permissions.includes(p))
      );
    }

    return permissions.map((p) => UIFriendlyPermissions[p as Permission] ?? p);
  }

  cancel() {
    this.router.navigate(['/settings/users']);
  }

  async updateUser() {
    const data = this.model.getData();

    if (this.adding) {
      const resultUser = await this.userManageService.createUser(data);
      if (HasFailed(resultUser)) {
        this.utilService.showSnackBar(
          'Failed to create user',
          SnackBarType.Error
        );
        return;
      }

      this.utilService.showSnackBar('User created', SnackBarType.Success);
    } else {
      const updateData = data.password
        ? data
        : { username: data.username, roles: data.roles };

      const resultUser = await this.userManageService.updateUser(
        updateData as any
      );
      if (HasFailed(resultUser)) {
        this.utilService.showSnackBar(
          'Failed to update user',
          SnackBarType.Error
        );
        return;
      }

      this.utilService.showSnackBar('User updated', SnackBarType.Success);
    }

    this.router.navigate(['/settings/users']);
  }

  isLockedPerms(): boolean {
    if (this.adding) {
      return false;
    } else {
      return this.ImmutableUsersList.includes(this.model.getData().username);
    }
  }
}
