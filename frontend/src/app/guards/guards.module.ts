import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule } from '../services/api/api.module';
import { PermissionGuard } from './permission.guard';

@NgModule({
  imports: [CommonModule, ApiModule],
  providers: [PermissionGuard],
  exports: [],
})
export class GuardsModule {}
