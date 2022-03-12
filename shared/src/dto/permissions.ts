// Config

export enum Permission {
  ImageView = 'image-view',
  ImageUpload = 'image-upload',
  UserLogin = 'user-login', // Ability to log in
  UserRegister = 'user-register', // Ability to register
  UserManage = 'user-manage',
  UserView = 'user-view', // Ability to view user details and refresh token
  RoleManage = 'role-manage',
  SysPrefManage = 'syspref-manage',
}

// Derivatives

export const PermissionsList: Permission[] = Object.values(Permission);

export type Permissions = Permission[];
