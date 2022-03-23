import { FormControl } from '@angular/forms';
import Fuse from 'fuse.js';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { PermanentRolesList } from 'picsur-shared/dist/dto/roles.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  CreatePasswordError,
  CreateUsernameError,
  PasswordValidators,
  UsernameValidators
} from './default-validators';
import { FullUserModel } from './fulluser.model';

export class UpdateUserControl {
  // Set once
  private fullRoles: ERole[] = [];
  private roles: string[] = [];

  // Variables
  private selectableRolesSubject = new BehaviorSubject<string[]>([]);
  private rolesInputSubscription: null | Subscription;

  public username = new FormControl('', UsernameValidators);
  public password = new FormControl('', PasswordValidators);

  public rolesControl = new FormControl('', []);
  public selectableRoles = this.selectableRolesSubject.asObservable();
  public selectedRoles: string[] = [];

  public get usernameValue() {
    return this.username.value;
  }

  public get usernameError() {
    return CreateUsernameError(this.username.errors);
  }

  public get passwordError() {
    return CreatePasswordError(this.password.errors);
  }

  constructor() {
    this.rolesInputSubscription = this.rolesControl.valueChanges.subscribe(
      (roles) => {
        this.updateSelectableRoles();
      }
    );
  }

  public destroy() {
    if (this.rolesInputSubscription) {
      this.rolesInputSubscription.unsubscribe();
      this.rolesInputSubscription = null;
    }
  }

  public addRole(role: string) {
    if (!this.selectableRolesSubject.value.includes(role)) return;

    this.selectedRoles.push(role);
    this.clearInput();
  }

  public removeRole(role: string) {
    this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    this.updateSelectableRoles();
  }

  public isRemovable(role: string) {
    if (PermanentRolesList.includes(role)) return false;
    return true;
  }

  public getEffectivePermissions(): Permissions {
    const permissions: Permissions = [];
    for (const role of this.selectedRoles) {
      const fullRole = this.fullRoles.find((r) => r.name === role);
      if (!fullRole) {
        console.warn(`Role ${role} not found`);
        continue;
      }

      permissions.push(
        ...fullRole.permissions.filter((p) => !permissions.includes(p))
      );
    }

    return permissions;
  }

  // Data interaction

  public putAllRoles(roles: ERole[]) {
    this.fullRoles = roles;
    this.roles = roles.map((role) => role.name);
    this.updateSelectableRoles();
  }

  public putUsername(username: string) {
    this.username.setValue(username);
  }

  public putRoles(roles: string[]) {
    this.selectedRoles = roles;
    this.updateSelectableRoles();
  }

  public getData(): FullUserModel {
    return {
      username: this.username.value,
      password: this.password.value,
      roles: this.selectedRoles,
    };
  }

  // Logic

  private updateSelectableRoles() {
    const availableRoles = this.roles.filter(
      // Not available if either already selected, or the role is not addable/removable
      (r) => !(this.selectedRoles.includes(r) || PermanentRolesList.includes(r))
    );

    const searchValue = this.rolesControl.value;
    if (searchValue && availableRoles.length > 0) {
      const fuse = new Fuse(availableRoles);
      const result = fuse
        .search(this.rolesControl.value ?? '')
        .map((r) => r.item);

      this.selectableRolesSubject.next(result);
    } else {
      this.selectableRolesSubject.next(availableRoles);
    }
  }

  private clearInput() {
    this.rolesControl.setValue('');
  }
}
