import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PRouteData } from 'src/app/models/picsur-routes';

@Injectable({
  providedIn: 'any',
})
export class SidebarResolverService
  implements Resolve<Portal<unknown> | undefined>
{
  constructor(private injector: Injector) {}

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
