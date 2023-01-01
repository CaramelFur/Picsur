import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrefOptionModule } from '../pref-option/pref-option.module';
import { PartialSysPrefComponent } from './partial-sys-pref.component';

@NgModule({
  imports: [
    CommonModule,
    PrefOptionModule
  ],
  declarations: [PartialSysPrefComponent],
  exports: [PartialSysPrefComponent],
})
export class PartialSysPrefModule {}
