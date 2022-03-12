import tuple from '../types/tuple';

// Config

const PermissionsTuple = tuple(
  'image-view',
  'image-upload',
  'user-login', // Ability to log in
  'user-register', // Ability to register
  'user-manage',
  'user-view', // Ability to view user details and refresh token
  'role-manage',
  'syspref-manage',
);

// Derivatives

export const PermissionsList: string[] = PermissionsTuple;

export type Permission = typeof PermissionsTuple[number];
export type Permissions = Permission[];
