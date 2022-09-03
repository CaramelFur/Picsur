import { Permission } from 'picsur-shared/dist/dto/permissions.enum';

export const UIFriendlyPermissions: {
  [key in Permission]: string;
} = {
  [Permission.ImageView]: 'View Images',
  [Permission.ImageUpload]: 'Upload Images',
  [Permission.ImageManage]: 'Manage Own Images',
  [Permission.ImageDeleteKey]: 'Use Deletekey',

  [Permission.UserLogin]: 'Login',
  [Permission.UserKeepLogin]: 'Stay Logged In',
  [Permission.UserRegister]: 'Register',

  [Permission.Settings]: 'View settings',

  [Permission.ApiKey]: 'Use API keys',

  [Permission.ImageAdmin]: 'Image Admin',
  [Permission.UserAdmin]: 'User Admin',
  [Permission.RoleAdmin]: 'Role Admin',
  [Permission.ApiKeyAdmin]: 'API Key Admin',
  [Permission.SysPrefAdmin]: 'System Admin',
};
