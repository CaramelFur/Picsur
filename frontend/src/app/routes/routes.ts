import { PageNotFoundRouteModule } from './pagenotfound/pagenotfound.module';
import { ProcessingRouteModule } from './processing/processing.module';
import { SettingsRouteModule } from './settings/settings.module';
import { UploadRouteModule } from './upload/upload.module';
import { UserRouteModule } from './user/user.module';
import { ViewRouteModule } from './view/view.module';

export const routes = [
  PageNotFoundRouteModule,
  UploadRouteModule,
  ProcessingRouteModule,
  ViewRouteModule,
  UserRouteModule,
  SettingsRouteModule,
];
