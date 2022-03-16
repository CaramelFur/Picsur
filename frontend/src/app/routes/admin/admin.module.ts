import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
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

    MatListModule,
    MatIconModule,
  ],
})
export class AdminRouteModule {}
