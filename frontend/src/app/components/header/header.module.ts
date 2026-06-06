import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { I18nModule } from '../../i18n/i18n.module';
import { HeaderComponent } from './header.component';
import { ErrorManagerModule } from '../../util/error-manager/error-manager.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorManagerModule,
    I18nModule,

    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
