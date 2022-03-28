import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { isPermissionsArray } from 'picsur-shared/dist/validators/permissions.validator';
import { PRouteData } from '../models/dto/picsur-routes.dto';
import { PermissionService } from '../services/api/permission.service';
import { Logger } from '../services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  private readonly logger = new Logger('PermissionGuard');
  private allPermissionsArray: string[] | null = null;

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.setupAllPermissions().catch(this.logger.error);
  }

  private async setupAllPermissions() {
    const permissions = await this.permissionService.fetchAllPermission();
    if (HasFailed(permissions)) {
      return this.logger.error(`Could not fetch all permissions`);
    }

    this.allPermissionsArray = permissions;
  }

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
    const requiredPermissions: string[] = this.nestedPermissions(route);

    // Check if permissions array is valid
    // But only if we actually have the data
    if (
      this.allPermissionsArray !== null &&
      !isPermissionsArray(requiredPermissions, this.allPermissionsArray)
    ) {
      this.logger.error(`Permissions array is invalid: ${requiredPermissions}`);
      return false;
    }

    const ourPermissions = await this.permissionService.loadedSnapshot();
    const weHavePermission = requiredPermissions.every((permission) =>
      ourPermissions.includes(permission)
    );

    if (!weHavePermission)
      this.router.navigate(['/error/401'], { replaceUrl: true });

    return weHavePermission;
  }

  // This aggregates nested permission for deep routes
  private nestedPermissions(route: ActivatedRouteSnapshot): string[] {
    const data: PRouteData = route.data;

    let permissions: string[] = [];
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
