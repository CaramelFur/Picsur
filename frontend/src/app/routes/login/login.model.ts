import { FormControl, Validators } from '@angular/forms';
import { Fail, Failable } from 'picsur-shared/dist/types';
import { LoginModel } from '../../models/login';

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

  public getData(): Failable<LoginModel> {
    if (this.username.errors || this.password.errors) {
      return Fail('Invalid username or password');
    } else {
      return {
        username: this.username.value,
        password: this.password.value,
      };
    }
  }
}
