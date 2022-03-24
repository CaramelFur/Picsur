import { Permission, Permissions, PermissionsList } from 'picsur-shared/dist/dto/permissions';
import tuple from 'picsur-shared/dist/types/tuple';

// Config

// These roles can never be removed or added to a user.
const SoulBoundRolesTuple = tuple('guest', 'user');
// These roles can never be modified
const ImmutableRolesTuple = tuple('admin');
// These roles can never be removed from the server
const UndeletableRolesTuple = tuple(...SoulBoundRolesTuple, ...ImmutableRolesTuple);
// These roles will be applied by default to new users
export const DefaultRolesList: string[] = ['user'];

// Derivatives
export const SoulBoundRolesList: string[] = SoulBoundRolesTuple;
export const ImmutableRolesList: string[] = ImmutableRolesTuple;
export const UndeletableRolesList: string[] = UndeletableRolesTuple;

// Defaults
type SystemRole = typeof UndeletableRolesTuple[number];
const SystemRoleDefaultsTyped: {
  [key in SystemRole]: Permissions;
} = {
  guest: [Permission.ImageView, Permission.UserLogin],
  user: [
    Permission.ImageView,
    Permission.UserKeepLogin,
    Permission.UserLogin,
    Permission.Settings,
    Permission.ImageUpload,
  ],
  // Grant all permissions to admin
  admin: PermissionsList,
};

export const SystemRoleDefaults = SystemRoleDefaultsTyped as {
  [key in string]: Permissions;
};
