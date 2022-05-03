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

  [Permission.ImageManage]: 'Manage All Images',
  [Permission.UserManage]: 'Manage users',
  [Permission.RoleManage]: 'Manage roles',
  [Permission.SysPrefManage]: 'Manage system',
};
