import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from './models/dto/picsur-routes.dto';
import { ErrorsRouteModule } from './routes/errors/errors.module';
import { ProcessingRouteModule } from './routes/processing/processing.module';
import { SettingsRouteModule } from './routes/settings/settings.module';
import { UploadRouteModule } from './routes/upload/upload.module';
import { UserRouteModule } from './routes/user/user.module';
import { ViewRouteModule } from './routes/view/view.module';

const routes: PRoutes = [
  {
    path: '',
    loadChildren: () => UploadRouteModule,
  },
  {
    path: 'processing',
    loadChildren: () => ProcessingRouteModule,
  },
  {
    path: 'view',
    loadChildren: () => ViewRouteModule,
  },
  {
    path: 'user',
    loadChildren: () => UserRouteModule,
  },
  {
    path: 'settings',
    loadChildren: () => SettingsRouteModule,
  },
  {
    path: 'error',
    loadChildren: () => ErrorsRouteModule,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      errorHandler: (error) => console.warn(error.message),
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
