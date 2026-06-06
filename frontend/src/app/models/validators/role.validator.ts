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
      return 'settings.roles.errors.required';
    case 'minlength':
      return 'settings.roles.errors.minLength';
    case 'maxlength':
      return 'settings.roles.errors.maxLength';
    case 'pattern':
      return 'settings.roles.errors.pattern';
    default:
      return 'settings.roles.errors.invalid';
  }
};
