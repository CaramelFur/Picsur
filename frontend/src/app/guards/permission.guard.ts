import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { isPermissionsArray } from 'picsur-shared/dist/util/permissions';
import { PRouteData } from '../models/picsur-routes';
import { PermissionService } from '../services/api/permission.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    //console.log('canActivateChild');
    return await this.can(childRoute, state);
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log('canActivate');
    return await this.can(route, state);
  }

  private async can(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredPermissions: Permissions = this.nestedPermissions(route);
    if (!isPermissionsArray(requiredPermissions)) {
      throw new Error(
        `PermissionGuard: route data 'permissions' must be an array of Permission values`
      );
    }

    const ourPermissions = await this.permissionService.loadedSnapshot();

    const isOk = requiredPermissions.every((permission) =>
      ourPermissions.includes(permission)
    );

    if (!isOk) {
      this.router.navigate(['/error/401'], { replaceUrl: true });
    }
    return isOk;
  }

  private nestedPermissions(route: ActivatedRouteSnapshot): Permissions {
    const data: PRouteData = route.data;

    let permissions: Permissions = [];
    if (data?.permissions) {
      permissions = permissions.concat(data.permissions);
    }
    if (route.firstChild) {
      permissions = permissions.concat(
        this.nestedPermissions(route.firstChild)
      );
    }
    return permissions;
  }
}
