import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsShareXComponent } from './settings-sharex.component';

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
