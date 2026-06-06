import { ValidationErrors, Validators } from '@angular/forms';
import { errorsToError } from './util.validator';

// Match this with user entity in shared lib
// (Security is not handled here, this is only for the user)

export const UsernameValidators = [
  Validators.minLength(4),
  Validators.maxLength(32),
  Validators.pattern('^[a-zA-Z0-9]+$'),
];

export const CreateUsernameError = (
  errors: ValidationErrors | null,
): string => {
  const error = errorsToError(errors);
  switch (error) {
    case 'required':
      return 'auth.usernameErrors.required';
    case 'minlength':
      return 'auth.usernameErrors.minLength';
    case 'maxlength':
      return 'auth.usernameErrors.maxLength';
    case 'pattern':
      return 'auth.usernameErrors.pattern';
    case 'unavailable':
      return 'auth.usernameErrors.unavailable';
    default:
      return 'auth.usernameErrors.invalid';
  }
};

export const PasswordValidators = [
  Validators.minLength(4),
  Validators.maxLength(1024),
];

export const CreatePasswordError = (
  errors: ValidationErrors | null,
): string => {
  const error = errorsToError(errors);
  switch (error) {
    case 'required':
      return 'auth.passwordErrors.required';
    case 'minlength':
      return 'auth.passwordErrors.minLength';
    case 'maxlength':
      return 'auth.passwordErrors.maxLength';
    case 'compare':
      return 'auth.passwordErrors.compare';
    default:
      return 'auth.passwordErrors.invalid';
  }
};
