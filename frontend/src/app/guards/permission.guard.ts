import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { isPermissionsArray } from 'picsur-shared/dist/util/permissions';
import { PermissionService } from '../services/api/permission.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredPermissions: Permissions = route.data['permissions'];
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
}
