export function isPermissionsArray(
  value: any,
  permissionsList: string[],
): value is string[] {
  if (!Array.isArray(value)) return false;
  if (!value.every((item: unknown) => typeof item === 'string')) return false;
  if (!value.every((item: string) => permissionsList.includes(item)))
    return false;
  return true;
}
