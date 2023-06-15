import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { isPermissionsArray } from 'picsur-shared/dist/validators/permissions.validator';
import { PRouteData } from '../models/dto/picsur-routes.dto';
import { PermissionService } from '../services/api/permission.service';
import { StaticInfoService } from '../services/api/static-info.service';
import { Logger } from '../services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly permissionService: PermissionService,
    private readonly staticInfo: StaticInfoService,
    private readonly router: Router,
  ) {}

  async canActivateChild(childRoute: ActivatedRouteSnapshot) {
    return await this.can(childRoute);
  }

  async canActivate(route: ActivatedRouteSnapshot) {
    return await this.can(route);
  }

  private async can(route: ActivatedRouteSnapshot) {
    const requiredPermissions: string[] = this.nestedPermissions(route);
    const allPermissionsArray = await this.staticInfo.getAllPermissions();

    // Check if permissions array is valid
    // But only if we actually have the data
    if (
      allPermissionsArray !== null &&
      !isPermissionsArray(requiredPermissions, allPermissionsArray)
    ) {
      this.logger.error(
        `Permissions array is invalid: "${requiredPermissions}" (available: ${allPermissionsArray})`,
      );
      return false;
    }

    const ourPermissions = await this.permissionService.getLoadedSnapshot();
    const weHavePermission = requiredPermissions.every((permission) =>
      ourPermissions.includes(permission),
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
        this.nestedPermissions(route.firstChild),
      );
    }
    return permissions;
  }
}
