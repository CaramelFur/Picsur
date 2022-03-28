import { ComponentType, Portal } from '@angular/cdk/portal';
import { Route } from '@angular/router';

export type PRouteData = {
  page?: {
    // This is not the tab-title, but the title in the sidenav
    title?: string;
    // This is not the favicon, but the icon in the sidenav
    icon?: string;
    category?: string;
  };
  permissions?: string[];
  noContainer?: boolean;
  sidebar?: ComponentType<unknown>;

  // This is not meant to be set by the user, but by a resolver service
  // It just cant be stored anywhere else
  _sidebar_portal?: Portal<unknown>;
};

export type PRoute = Route & {
  data?: PRouteData;
};

export type PRoutes = PRoute[];
