import tuple from '../types/tuple';
import { Permissions, PermissionsList } from './permissions';

// Config

// These roles can never be removed from a user
const PermanentRolesTuple = tuple('guest', 'user');
// These reles can never be modified
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
  guest: ['image-view', 'user-login'],
  user: ['image-view', 'user-view', 'user-login', 'image-upload'],
  // Grant all permissions to admin
  admin: PermissionsList as Permissions,
};

// Normal roles types

export type Role = SystemRole | string;
export type Roles = Role[];
