import { FormControl } from '@angular/forms';
import { FullUserModel } from '../forms-dto/fulluser.dto';
import {
  CreatePasswordError,
  CreateUsernameError,
  PasswordValidators,
  UsernameValidators
} from '../validators/user.validator';

export class UpdateUserControl {
  public username = new FormControl('', UsernameValidators);
  public password = new FormControl('', PasswordValidators);
  public roles = new FormControl([]);

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
    return this.roles.value;
  }

  // Data interaction

  public putUsername(username: string) {
    this.username.setValue(username);
  }

  public putRoles(roles: string[]) {
    this.roles.setValue(roles);
  }

  public getData(): FullUserModel {
    return {
      username: this.username.value,
      password: this.password.value,
      roles: this.selectedRoles,
    };
  }
}
