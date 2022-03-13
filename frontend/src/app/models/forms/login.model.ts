import { FormControl, Validators } from '@angular/forms';
import { Fail, Failable } from 'picsur-shared/dist/types';
import { UserPassModel } from './userpass';

export class LoginControl {
  public username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  public password = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  public get usernameError() {
    return this.username.hasError('required')
      ? 'Username is required'
      : this.username.hasError('minlength')
      ? 'Username is too short'
      : '';
  }

  public get passwordError() {
    return this.password.hasError('required')
      ? 'Password is required'
      : this.password.hasError('minlength')
      ? 'Password is too short'
      : '';
  }

  public getData(): Failable<UserPassModel> {
    if (this.username.errors || this.password.errors) {
      return Fail('Invalid username or password');
    } else {
      return {
        username: this.username.value,
        password: this.password.value,
      };
    }
  }

  public getRawData(): UserPassModel {
    return {
      username: this.username.value,
      password: this.password.value,
    };
  }

  public putData(data: UserPassModel) {
    this.username.setValue(data.username);
    this.password.setValue(data.password);
  }
}
