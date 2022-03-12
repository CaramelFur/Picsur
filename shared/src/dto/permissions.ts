import tuple from '../types/tuple';

// Config

const PermissionsTuple = tuple(
  'image-view',
  'image-upload',
  'user-login', // Ability to log in
  'user-register', // Ability to register
  'user-view', // Ability to view user info, only granted if logged in
  'user-manage',
  'syspref-manage',
);

// Derivatives

export const PermissionsList: string[] = PermissionsTuple;

export type Permission = typeof PermissionsTuple[number];
export type Permissions = Permission[];
