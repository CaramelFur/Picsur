import { isArray, isEnum, isString } from 'class-validator';

export function isPermissionsArray(
  value: any,
  permissionsList: string[],
): value is string[] {
  if (!isArray(value)) return false;
  if (!value.every((item: unknown) => isString(item))) return false;
  if (!value.every((item: string) => isEnum(item, permissionsList)))
    return false;
  return true;
}
