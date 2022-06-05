import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function Compare(compareTo: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== compareTo.value) {
      return {
        compare: true,
      };
    }
    return null;
  };
}
