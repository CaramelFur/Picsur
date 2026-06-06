import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import MatSelectInfiniteScrollModule from '../../../components/infinite-select/infinite-select.module';
import { I18nModule } from '../../../i18n/i18n.module';
import { ErrorManagerModule } from '../../../util/error-manager/error-manager.module';
import { SettingsShareXComponent } from './settings-sharex.component';
import { SettingsShareXRoutingModule } from './settings-sharex.routing.module';

@NgModule({
  declarations: [SettingsShareXComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    I18nModule,

    SettingsShareXRoutingModule,
    MatSelectModule,
    MatSelectInfiniteScrollModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export default class SettingsShareXRouteModule {}
