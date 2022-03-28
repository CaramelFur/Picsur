import { ValidationErrors } from '@angular/forms';

export function errorsToError(errors: ValidationErrors | null): string {
  if (errors) {
    const error = Object.keys(errors)[0];
    return error;
  }
  return 'unkown';
}
