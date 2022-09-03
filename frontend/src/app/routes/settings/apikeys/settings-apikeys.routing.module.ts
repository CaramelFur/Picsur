import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsApiKeysComponent } from './settings-apikeys.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsApiKeysComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsApiKeysRoutingModule {}
