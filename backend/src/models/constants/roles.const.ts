import tuple from 'picsur-shared/dist/types/tuple';
import { Permission, Permissions, PermissionsList } from './permissions.const.js';

// Config

// These roles can never be removed or added to a user.
const SoulBoundRolesTuple = tuple('guest', 'user');
// These roles can never be modified
const ImmutableRolesTuple = tuple('admin');
// These roles can never be removed from the server
const UndeletableRolesTuple = tuple(
  ...SoulBoundRolesTuple,
  ...ImmutableRolesTuple,
);
// These roles will be applied by default to new users
export const DefaultRolesList: string[] = ['user'];

// These permissions will be locked for the specified roles
export const RolePermissionsLocks: {
  [key in string]: Permission[];
} = {
  guest: [Permission.UserLogin],
  user: [],
  admin: [],
};

// Derivatives
export const SoulBoundRolesList: string[] = SoulBoundRolesTuple;
export const ImmutableRolesList: string[] = ImmutableRolesTuple;
export const UndeletableRolesList: string[] = UndeletableRolesTuple;

// Yes this is the undeletableroles list
export const SystemRolesList = UndeletableRolesList;

// Defaults
type SystemRole = (typeof UndeletableRolesTuple)[number];
const SystemRoleDefaultsTyped: {
  [key in SystemRole]: Permissions;
} = {
  guest: [
    Permission.UserLogin,
    Permission.ImageView,
    Permission.ImageDeleteKey,
  ],
  user: [
    Permission.ImageView,
    Permission.ImageDeleteKey,
    Permission.ImageManage,
    Permission.ImageUpload,
    Permission.UserKeepLogin,
    Permission.UserLogin,
    Permission.Settings,
    Permission.ApiKey,
  ],
  // Grant all permissions to admin
  admin: PermissionsList,
};

export const SystemRoleDefaults = SystemRoleDefaultsTyped as {
  [key in string]: Permissions;
};
