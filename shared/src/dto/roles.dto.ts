import tuple from '../types/tuple';
import { Permission, Permissions, PermissionsList } from './permissions';

// Config

// These roles can never be removed or added to a user.
const PermanentRolesTuple = tuple('guest', 'user');
// These roles can never be modified
const ImmuteableRolesTuple = tuple('admin');
// These roles can never be removed from the server
const SystemRolesTuple = tuple(...PermanentRolesTuple, ...ImmuteableRolesTuple);

// Derivatives

export const PermanentRolesList: string[] = PermanentRolesTuple;
export const ImmuteableRolesList: string[] = ImmuteableRolesTuple;
export const SystemRolesList: string[] = SystemRolesTuple;

export type SystemRole = typeof SystemRolesTuple[number];
export type SystemRoles = SystemRole[];

// Defaults

export const SystemRoleDefaults: {
  [key in SystemRole]: Permissions;
} = {
  guest: [Permission.ImageView, Permission.UserLogin],
  user: [
    Permission.ImageView,
    Permission.UserMe,
    Permission.UserLogin,
    Permission.Settings,
    Permission.ImageUpload,
  ],
  // Grant all permissions to admin
  admin: PermissionsList,
};

// Normal roles types

export type Role = SystemRole | string;
export type Roles = Role[];
