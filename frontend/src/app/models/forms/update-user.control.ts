import { FormControl } from '@angular/forms';
import {
  UserCreateRequest,
  UserUpdateRequest,
} from 'picsur-shared/dist/dto/api/user-manage.dto';
import {
  CreatePasswordError,
  CreateUsernameError,
  PasswordValidators,
  UsernameValidators,
} from '../validators/user.validator';

export class UpdateUserControl {
  private id = '';
  public username = new FormControl('', UsernameValidators);
  public password = new FormControl('', PasswordValidators);
  public roles = new FormControl<string[]>([]);

  public get usernameValue() {
    return this.username.value;
  }

  public get usernameError() {
    return CreateUsernameError(this.username.errors);
  }

  public get passwordError() {
    return CreatePasswordError(this.password.errors);
  }

  public get selectedRoles(): string[] {
    return this.roles.value ?? [];
  }

  // Data interaction

  public putId(id: string) {
    this.id = id;
  }

  public putUsername(username: string) {
    this.username.setValue(username);
  }

  public putRoles(roles: string[]) {
    this.roles.setValue(roles);
  }

  public getDataCreate(): UserCreateRequest {
    return {
      username: this.username.value ?? '',
      password: this.password.value ?? '',
      roles: this.selectedRoles,
    };
  }

  public getDataUpdate(): UserUpdateRequest {
    return {
      ...this.getDataCreate(),
      id: this.id,
    };
  }
}
