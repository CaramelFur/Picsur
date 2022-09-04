import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogManagerModule } from '../dialog-manager/dialog-manager.module';
import { ErrorManagerModule } from '../error-manager/error-manager.module';
import { CompatibilityService } from './compatibility.service';

@NgModule({
  imports: [CommonModule, DialogManagerModule, ErrorManagerModule],
  providers: [CompatibilityService],
})
export class CompatibilityManagerModule {
  constructor(compatibilityService: CompatibilityService) {
    compatibilityService.nothing();
  }
}
