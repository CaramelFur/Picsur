export function HasAPermissionOf(
  compoundPermission: string[],
  yourPermissions: string[],
): boolean {
  return compoundPermission.some((permission: string) =>
    yourPermissions.includes(permission),
  );
}
