import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { UIFriendlyPermissions } from '../../../../i18n/permissions.i18n';
import { UpdateRoleControl } from '../../../../models/forms/update-role.control';
import { RolesService } from '../../../../services/api/roles.service';
import { StaticInfoService } from '../../../../services/api/static-info.service';
import { Logger } from '../../../../services/logger/logger.service';
import { ErrorService } from '../../../../util/error-manager/error.service';

enum EditMode {
  edit = 'edit',
  add = 'add',
}
@Component({
  selector: 'app-settings-roles-edit',
  templateUrl: './settings-roles-edit.component.html',
  styleUrls: ['./settings-roles-edit.component.scss'],
})
export class SettingsRolesEditComponent implements OnInit {
  private readonly logger = new Logger(SettingsRolesEditComponent.name);

  private mode: EditMode = EditMode.edit;

  model = new UpdateRoleControl();
  allPermissions: string[] = [];
  lockedPermissions: string[] = [];

  get adding() {
    return this.mode === EditMode.add;
  }
  get editing() {
    return this.mode === EditMode.edit;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly rolesService: RolesService,
    private readonly staticInfo: StaticInfoService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit() {
    Promise.all([this.initRole(), this.initPermissions()]).catch(
      this.logger.error,
    );
  }

  private async initRole() {
    // Check if adding or editing
    const rolename = this.route.snapshot.paramMap.get('role');
    if (!rolename) {
      this.mode = EditMode.add;
      return;
    }
    this.mode = EditMode.edit;
    this.model.putRoleName(rolename);

    // Get special permissions
    const SpecialRoles = await this.staticInfo.getSpecialRoles();
    this.lockedPermissions = SpecialRoles.LockedPermissions[rolename];

    // Fetch data and populate form
    const role = await this.rolesService.getRole(rolename);
    if (HasFailed(role))
      return this.errorService.showFailure(role, this.logger);
    this.model.putRoleName(role.name);
    this.model.putPermissions(role.permissions);
  }

  private async initPermissions() {
    // Get a list of all permissions so that we can select them
    this.allPermissions = await this.staticInfo.getAllPermissions();
  }

  async updateRole() {
    const data = this.model.getData();

    if (this.adding) {
      const resultRole = await this.rolesService.createRole(data);
      if (HasFailed(resultRole))
        return this.errorService.showFailure(resultRole, this.logger);

      this.errorService.success('Role created');
    } else {
      const resultRole = await this.rolesService.updateRole(data);
      if (HasFailed(resultRole))
        return this.errorService.showFailure(resultRole, this.logger);

      this.errorService.success('Role updated');
    }

    this.router.navigate(['/settings/roles']);
  }

  cancel() {
    this.router.navigate(['/settings/roles']);
  }

  public UIFriendlyPermission(name: string) {
    return UIFriendlyPermissions[name as Permission] ?? name;
  }
}
