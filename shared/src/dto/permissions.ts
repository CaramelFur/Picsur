// Config

export enum Permission {
  ImageView = 'image-view',
  ImageUpload = 'image-upload',

  UserLogin = 'user-login', // Ability to log in
  UserMe = 'user-me', // Ability to view own user details and refresh token
  UserRegister = 'user-register', // Ability to register

  UserManage = 'user-manage', // Allow modification of users
  RoleManage = 'role-manage', // Allow modification of roles
  SysPrefManage = 'syspref-manage',
}

// Derivatives

export const PermissionsList: Permission[] = Object.values(Permission);

export type Permissions = Permission[];
