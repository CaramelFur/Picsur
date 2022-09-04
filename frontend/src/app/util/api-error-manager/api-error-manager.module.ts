import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SnackBarManagerModule } from '../snackbar-manager/snackbar-manager.module';
import { ApiErrorService } from './api-error.service';

@NgModule({
  imports: [CommonModule, SnackBarManagerModule.forRoot()],
  providers: [ApiErrorService],
})
export class ApiErrorManagerModule {
  // Start apiErrorService, the nothing function does nothing, but it silents the error.
  constructor(apiErrorService: ApiErrorService) {
    apiErrorService.nothing();
  }
}
