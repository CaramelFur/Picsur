// Config

import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
export { Permission } from 'picsur-shared/dist/dto/permissions.enum';

// Derivatives

export const PermissionsList: Permission[] = Object.values(Permission);
export type Permissions = Permission[];
