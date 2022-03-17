import { Route } from '@angular/router';
import { Permissions } from 'picsur-shared/dist/dto/permissions';


export type PRouteData = {
  page?: {
    title?: string;
    icon?: string;
    category?: string;
  };
  permissions?: Permissions;
  noContainer?: boolean;
  sidebar?: string;
};

export type PRoute = Route & {
  data?: PRouteData;
};

export type PRoutes = PRoute[];
