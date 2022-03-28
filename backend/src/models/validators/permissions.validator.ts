import { isPermissionsArray as isPArr } from 'picsur-shared/dist/validators/permissions.validator';
import { Permissions, PermissionsList } from '../dto/permissions.dto';

export function isPermissionsArray(value: any): value is Permissions {
  return isPArr(value, PermissionsList);
}
