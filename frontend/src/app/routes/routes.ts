import { AdminRouteModule } from './admin/admin.module';
import { PageNotFoundRouteModule } from './pagenotfound/pagenotfound.module';
import { ProcessingRouteModule } from './processing/processing.module';
import { UploadRouteModule } from './upload/upload.module';
import { UserRouteModule } from './user/user.module';
import { ViewRouteModule } from './view/view.module';

export const routes = [
  PageNotFoundRouteModule,
  UploadRouteModule,
  ProcessingRouteModule,
  ViewRouteModule,
  UserRouteModule,
  AdminRouteModule,
];
