import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsShareXComponent } from './settings-sharex.component';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsShareXComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsShareXRoutingModule {}
