import { ComponentType } from '@angular/cdk/portal';
import { Route } from '@angular/router';
import { Permissions } from 'picsur-shared/dist/dto/permissions';

export type PRouteData = {
  permissions?: Permissions;
  noContainer?: boolean;
  sidebar?: ComponentType<unknown>;
};

export type PRoute = Route & {
  data?: PRouteData;
};

export type PRoutes = PRoute[];
