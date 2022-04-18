import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsSysprefComponent } from './settings-sys-pref.component';

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
