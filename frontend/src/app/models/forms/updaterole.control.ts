import { FormControl } from '@angular/forms';
import Fuse from 'fuse.js';
import { Permission, Permissions } from 'picsur-shared/dist/dto/permissions';
import { PermanentRolesList } from 'picsur-shared/dist/dto/roles.dto';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RoleNameValidators } from './role-validators';
import { RoleModel } from './role.model';
import { CreateUsernameError } from './user-validators';

export class UpdateRoleControl {
  // Set once
  private permissions: Permissions = [];

  // Variables
  private selectablePermissionsSubject = new BehaviorSubject<Permissions>([]);
  private permissionsInputSubscription: null | Subscription;

  public rolename = new FormControl('', RoleNameValidators);

  public permissionControl = new FormControl('', []);
  public selectablePermissions =
    this.selectablePermissionsSubject.asObservable();
  public selectedPermissions: Permissions = [];

  public get rolenameValue() {
    return this.rolename.value;
  }

  public get rolenameError() {
    return CreateUsernameError(this.rolename.errors);
  }

  constructor() {
    this.permissionsInputSubscription =
      this.permissionControl.valueChanges.subscribe((roles) => {
        this.updateSelectablePermissions();
      });
  }

  public destroy() {
    if (this.permissionsInputSubscription) {
      this.permissionsInputSubscription.unsubscribe();
      this.permissionsInputSubscription = null;
    }
  }

  public addPermission(role: Permission) {
    if (!this.selectablePermissionsSubject.value.includes(role)) return;

    this.selectedPermissions.push(role);
    this.clearInput();
  }

  public removePermission(role: Permission) {
    this.selectedPermissions = this.selectedPermissions.filter(
      (r) => r !== role
    );
    this.updateSelectablePermissions();
  }

  public isRemovable(role: Permission) {
    if (PermanentRolesList.includes(role)) return false;
    return true;
  }

  // Data interaction

  public putAllPermissions(permissions: Permissions) {
    this.permissions = permissions;
    this.updateSelectablePermissions();
  }

  public putRoleName(rolename: string) {
    this.rolename.setValue(rolename);
  }

  public putPermissions(permissions: Permissions) {
    this.selectedPermissions = permissions;
    this.updateSelectablePermissions();
  }

  public getData(): RoleModel {
    return {
      name: this.rolenameValue,
      permissions: this.selectedPermissions,
    };
  }

  // Logic

  private updateSelectablePermissions() {
    const availablePermissins = this.permissions.filter(
      (r) => !this.selectedPermissions.includes(r)
    );

    const searchValue = this.permissionControl.value;
    if (searchValue && availablePermissins.length > 0) {
      const fuse = new Fuse(availablePermissins);
      const result = fuse
        .search(this.permissionControl.value ?? '')
        .map((r) => r.item);

      this.selectablePermissionsSubject.next(result);
    } else {
      this.selectablePermissionsSubject.next(availablePermissins);
    }
  }

  private clearInput() {
    this.permissionControl.setValue('');
  }
}
