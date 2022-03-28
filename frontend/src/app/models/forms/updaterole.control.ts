import { FormControl } from '@angular/forms';
import Fuse from 'fuse.js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RoleModel } from '../forms-dto/role.dto';
import { RoleNameValidators } from '../validators/role.validator';
import { CreateUsernameError } from '../validators/user.validator';

export class UpdateRoleControl {
  // Set once
  private permissions: string[] = [];

  // Variables
  private selectablePermissionsSubject = new BehaviorSubject<string[]>([]);
  private permissionsInputSubscription: null | Subscription;

  public rolename = new FormControl('', RoleNameValidators);

  public permissionControl = new FormControl('', []);
  public selectablePermissions =
    this.selectablePermissionsSubject.asObservable();
  public selectedPermissions: string[] = [];

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

  public addPermission(permission: string) {
    if (!this.selectablePermissionsSubject.value.includes(permission)) return;

    this.selectedPermissions.push(permission);
    this.clearInput();
  }

  public removePermission(permission: string) {
    this.selectedPermissions = this.selectedPermissions.filter(
      (r) => r !== permission
    );
    this.updateSelectablePermissions();
  }

  // Data interaction

  public putAllPermissions(permissions: string[]) {
    this.permissions = permissions;
    this.updateSelectablePermissions();
  }

  public putRoleName(rolename: string) {
    this.rolename.setValue(rolename);
  }

  public putPermissions(permissions: string[]) {
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
