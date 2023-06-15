import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PRouteData } from '../../models/dto/picsur-routes.dto';

// This service makes sure that any sidebar components are getting dependency injection
// from their correct module. Instead of getting it from the module where it is being
// sent via the portal.

@Injectable({
  providedIn: 'any',
})
export class SidebarResolverService
  implements Resolve<Portal<unknown> | undefined>
{
  constructor(private readonly injector: Injector) {}

  resolve(route: ActivatedRouteSnapshot) {
    const data: PRouteData = route.data;
    if (!data.sidebar) return undefined;

    return new ComponentPortal(data.sidebar, null, this.injector);
  }

  static build() {
    return {
      _sidebar_portal: SidebarResolverService,
    };
  }
}
