import { ValidationErrors, Validators } from '@angular/forms';
import { errorsToError } from './util.validator';

export const RoleNameValidators = [
  Validators.minLength(4),
  Validators.maxLength(32),
  Validators.pattern('^[a-zA-Z0-9]+$'),
];

export const CreateRoleNameError = (
  errors: ValidationErrors | null,
): string => {
  const error = errorsToError(errors);
  switch (error) {
    case 'required':
      return 'Role name is required';
    case 'minlength':
      return 'Role name is too short';
    case 'maxlength':
      return 'Role name is too long';
    case 'pattern':
      return 'Role name can only contain letters and numbers';
    default:
      return 'Invalid role name';
  }
};
