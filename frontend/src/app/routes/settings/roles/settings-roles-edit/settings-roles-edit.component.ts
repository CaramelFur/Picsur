import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UpdateRoleControl } from 'src/app/models/forms/updaterole.control';
import { PermissionService } from 'src/app/services/api/permission.service';
import { RolesService } from 'src/app/services/api/roles.service';
import { UtilService } from 'src/app/util/util.service';

enum EditMode {
  edit = 'edit',
  add = 'add',
}
@Component({
  selector: 'app-settings-roles-edit',
  templateUrl: './settings-roles-edit.component.html',
})
export class SettingsRolesEditComponent implements OnInit {
  private mode: EditMode = EditMode.edit;

  model = new UpdateRoleControl();
  allPermissions: string[] = [];

  get adding() {
    return this.mode === EditMode.add;
  }
  get editing() {
    return this.mode === EditMode.edit;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private rolesService: RolesService,
    private permissionsService: PermissionService
  ) {}

  ngOnInit() {
    Promise.all([this.initRole(), this.initPermissions()]).catch(console.error);
  }

  private async initRole() {
    // Check if adding or editing
    const rolename = this.route.snapshot.paramMap.get('role');
    if (!rolename) {
      this.mode = EditMode.add;
      return;
    }

    // Set data thats already known
    this.mode = EditMode.edit;
    this.model.putRoleName(rolename);

    // Fetch data and populate form
    const role = await this.rolesService.getRole(rolename);
    if (HasFailed(role)) {
      this.utilService.showSnackBar('Failed to get role', SnackBarType.Error);
      return;
    }
    this.model.putRoleName(role.name);
    this.model.putPermissions(role.permissions);
  }

  private async initPermissions() {
    // Get a list of all permissions so that we can select them
    const allPermissions = await this.permissionsService.fetchAllPermission();
    if (HasFailed(allPermissions)) {
      this.utilService.showSnackBar(
        'Failed to fetch permissions',
        SnackBarType.Error
      );
      return;
    }

    this.allPermissions = allPermissions;
  }

  async updateRole() {
    const data = this.model.getData();

    if (this.adding) {
      const resultRole = await this.rolesService.createRole(data);
      if (HasFailed(resultRole)) {
        this.utilService.showSnackBar(
          'Failed to create role',
          SnackBarType.Error
        );
        return;
      }

      this.utilService.showSnackBar('Role created', SnackBarType.Success);
    } else {
      const resultRole = await this.rolesService.updateRole(data);
      if (HasFailed(resultRole)) {
        this.utilService.showSnackBar(
          'Failed to update role',
          SnackBarType.Error
        );
        return;
      }

      this.utilService.showSnackBar('Role updated', SnackBarType.Success);
    }

    this.router.navigate(['/settings/roles']);
  }

  cancel() {
    this.router.navigate(['/settings/roles']);
  }
}
