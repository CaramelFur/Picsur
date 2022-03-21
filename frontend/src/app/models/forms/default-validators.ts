import { ValidationErrors, Validators } from '@angular/forms';

// Match this with user entity in shared lib
// (Security is not handled here, this is only for the user)

function errorsToError(errors: ValidationErrors | null): string {
  if (errors) {
    const error = Object.keys(errors)[0];
    return error;
  }
  return 'unkown';
}

export const UsernameValidators = [
  Validators.required,
  Validators.minLength(4),
  Validators.maxLength(32),
  Validators.pattern('^[a-zA-Z0-9]+$'),
];

export const CreateUsernameError = (
  errors: ValidationErrors | null
): string => {
  const error = errorsToError(errors);
  switch (error) {
    case 'required':
      return 'Username is required';
    case 'minlength':
      return 'Username is too short';
    case 'maxlength':
      return 'Username is too long';
    case 'pattern':
      return 'Username can only contain letters and numbers';
    default:
      return 'Invalid username';
  }
};

export const PasswordValidators = [
  Validators.required,
  Validators.minLength(4),
  Validators.maxLength(1024),
];

export const CreatePasswordError = (
  errors: ValidationErrors | null
): string => {
  const error = errorsToError(errors);
  switch (error) {
    case 'required':
      return 'Password is required';
    case 'minlength':
      return 'Password is too short';
    case 'maxlength':
      return 'Password is too long';
    case 'compare':
      return 'Password does not match';
    default:
      return 'Invalid password';
  }
};
