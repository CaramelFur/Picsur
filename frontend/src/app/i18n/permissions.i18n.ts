import { Permission } from 'picsur-shared/dist/dto/permissions.enum';

export const UIPermissionTranslationKeys: {
  [key in Permission]: string;
} = {
  [Permission.ImageView]: 'permissions.imageView',
  [Permission.ImageUpload]: 'permissions.imageUpload',
  [Permission.ImageManage]: 'permissions.imageManage',
  [Permission.ImageDeleteKey]: 'permissions.imageDeleteKey',

  [Permission.UserLogin]: 'permissions.userLogin',
  [Permission.UserKeepLogin]: 'permissions.userKeepLogin',
  [Permission.UserRegister]: 'permissions.userRegister',

  [Permission.Settings]: 'permissions.settings',

  [Permission.ApiKey]: 'permissions.apiKey',

  [Permission.ImageAdmin]: 'permissions.imageAdmin',
  [Permission.UserAdmin]: 'permissions.userAdmin',
  [Permission.RoleAdmin]: 'permissions.roleAdmin',
  [Permission.ApiKeyAdmin]: 'permissions.apiKeyAdmin',
  [Permission.SysPrefAdmin]: 'permissions.sysPrefAdmin',
};
