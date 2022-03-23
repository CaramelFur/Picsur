// Config

export enum Permission {
  ImageView = 'image-view',
  ImageUpload = 'image-upload',

  UserLogin = 'user-login', // Ability to log in
  UserMe = 'user-me', // Ability to view own user details and refresh token
  UserRegister = 'user-register', // Ability to register

  Settings = 'settings', // Ability to view (personal) settings

  UserManage = 'user-manage', // Allow modification of users
  RoleManage = 'role-manage', // Allow modification of roles
  SysPrefManage = 'syspref-manage',
}

// Derivatives

export const PermissionsList: Permission[] = Object.values(Permission);

export type Permissions = Permission[];

// Compound permission lists
export const AdminDashboardPermissions: Permissions = [
  Permission.UserManage,
  Permission.RoleManage,
  Permission.SysPrefManage,
];

export const UIFriendlyPermissions: {
  [key in Permission]: string;
} = {
  [Permission.ImageView]: 'View images',
  [Permission.ImageUpload]: 'Upload images',

  [Permission.UserLogin]: 'Login',
  [Permission.UserMe]: 'View self',
  [Permission.UserRegister]: 'Register',

  [Permission.Settings]: 'View settings',

  [Permission.UserManage]: 'Manage users',
  [Permission.RoleManage]: 'Manage roles',
  [Permission.SysPrefManage]: 'Manage system',
};
