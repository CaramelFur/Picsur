import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsSysprefComponent } from './settings-sys-pref.component';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsSysprefComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsSysprefRoutingModule {}
