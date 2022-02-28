import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AppRouterModule } from 'src/app/router/router.module';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, AppRouterModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
