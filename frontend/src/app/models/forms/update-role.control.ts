import { FormControl } from '@angular/forms';
import { RoleModel } from '../forms-dto/role.dto';
import {
  CreateRoleNameError,
  RoleNameValidators,
} from '../validators/role.validator';

export class UpdateRoleControl {
  public rolename = new FormControl('', RoleNameValidators);
  public permissions = new FormControl<string[]>([]);

  public get rolenameValue() {
    return this.rolename.value;
  }

  public get rolenameError() {
    return CreateRoleNameError(this.rolename.errors);
  }

  public get selectedPermissions() {
    return this.permissions.value;
  }

  // Data interaction

  public putRoleName(rolename: string) {
    this.rolename.setValue(rolename);
  }

  public putPermissions(permissions: string[]) {
    this.permissions.setValue(permissions);
  }

  public getData(): RoleModel {
    return {
      name: this.rolenameValue ?? '',
      permissions: this.selectedPermissions ?? [],
    };
  }
}
