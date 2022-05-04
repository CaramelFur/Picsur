import { Permission } from 'picsur-shared/dist/dto/permissions.dto';

export const UIFriendlyPermissions: {
  [key in Permission]: string;
} = {
  [Permission.ImageView]: 'View Images',
  [Permission.ImageUpload]: 'Upload Images',

  [Permission.UserLogin]: 'Login',
  [Permission.UserKeepLogin]: 'Stay Logged In',
  [Permission.UserRegister]: 'Register',

  [Permission.Settings]: 'View settings',

  [Permission.ImageAdmin]: 'Image Admin',
  [Permission.UserAdmin]: 'User Admin',
  [Permission.RoleAdmin]: 'Role Admin',
  [Permission.SysPrefAdmin]: 'System Admin',
};
