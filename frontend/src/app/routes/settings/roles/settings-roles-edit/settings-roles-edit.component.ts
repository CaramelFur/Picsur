import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Permission,
  PermissionsList,
  UIFriendlyPermissions
} from 'picsur-shared/dist/dto/permissions';
import { HasFailed } from 'picsur-shared/dist/types';
import { UpdateRoleControl } from 'src/app/models/forms/updaterole.control';
import { SnackBarType } from 'src/app/models/snack-bar-type';
import { RolesService } from 'src/app/services/api/roles.service';
import { UtilService } from 'src/app/util/util.service';

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
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  private mode: EditMode = EditMode.edit;

  model = new UpdateRoleControl();

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
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    Promise.all([this.initRole(), this.initPermissions()]).catch(console.error);
  }

  private async initRole() {
    const rolename = this.route.snapshot.paramMap.get('role');
    if (!rolename) {
      this.mode = EditMode.add;
      return;
    }

    this.mode = EditMode.edit;
    this.model.putRoleName(rolename);

    const role = await this.rolesService.getRole(rolename);
    if (HasFailed(role)) {
      this.utilService.showSnackBar('Failed to get role', SnackBarType.Error);
      return;
    }

    this.model.putRoleName(role.name);
    this.model.putPermissions(role.permissions);
  }

  private async initPermissions() {
    this.model.putAllPermissions(PermissionsList);
  }

  removePermission(permission: Permission) {
    this.model.removePermission(permission);
  }

  addPermission(event: MatChipInputEvent) {
    const value = (event.value ?? '').trim();
    this.model.addPermission(value as Permission);
  }

  selectedPermission(event: MatAutocompleteSelectedEvent): void {
    this.model.addPermission(event.option.viewValue as Permission);
  }

  cancel() {
    this.router.navigate(['/settings/roles']);
  }

  uiFriendlyPermission(permission: Permission) {
    return UIFriendlyPermissions[permission];
  }

  async updateUser() {
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
}
