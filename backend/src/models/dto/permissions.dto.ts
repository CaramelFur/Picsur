// Config

import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
export { Permission } from 'picsur-shared/dist/dto/permissions.dto';

// Derivatives

export const PermissionsList: Permission[] = Object.values(Permission);

export type Permissions = Permission[];
