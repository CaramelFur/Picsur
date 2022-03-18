import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsSysprefComponent } from './settings-syspref.component';

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
