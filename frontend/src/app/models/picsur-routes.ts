import { ComponentType, Portal } from '@angular/cdk/portal';
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
  sidebar?: ComponentType<unknown>;
  _sidebar_portal?: Portal<unknown>;
};

export type PRoute = Route & {
  data?: PRouteData;
};

export type PRoutes = PRoute[];
