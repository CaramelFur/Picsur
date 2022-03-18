import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionGuard } from './permission.guard';

@NgModule({
  imports: [CommonModule],
  providers: [PermissionGuard],
  exports: [],
})
export class GuardsModule {}
