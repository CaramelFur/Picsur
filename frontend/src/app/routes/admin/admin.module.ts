import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminRoutingModule } from './admin.routing.module';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [AdminComponent, AdminSidebarComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatProgressSpinnerModule,
  ],
})
export class AdminRouteModule {}
