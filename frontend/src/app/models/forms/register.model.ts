import { FormControl, Validators } from '@angular/forms';
import { Fail, Failable } from 'picsur-shared/dist/types';
import { Compare } from './compare.validator';
import { UserPassModel } from './userpass';

export class RegisterControl {
  public username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  public password = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  public passwordConfirm = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Compare(this.password),
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

  public get passwordConfirmError() {
    return this.passwordConfirm.hasError('required')
      ? 'Password confirmation is required'
      : this.passwordConfirm.hasError('minlength')
      ? 'Password confirmation is too short'
      : this.passwordConfirm.hasError('compare')
      ? 'Password confirmation does not match'
      : '';
  }

  public getData(): Failable<UserPassModel> {
    if (
      this.username.errors ||
      this.password.errors ||
      this.passwordConfirm.errors
    ) {
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
    this.passwordConfirm.setValue(data.password);
  }
}
