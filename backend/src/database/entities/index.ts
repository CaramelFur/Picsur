import { EApiKeyBackend } from './apikey.entity.js';
import { EImageDerivativeBackend } from './images/image-derivative.entity.js';
import { EImageFileBackend } from './images/image-file.entity.js';
import { EImageBackend } from './images/image.entity.js';
import { ESysPreferenceBackend } from './system/sys-preference.entity.js';
import { ESystemStateBackend } from './system/system-state.entity.js';
import { EUsrPreferenceBackend } from './system/usr-preference.entity.js';
import { ERoleBackend } from './users/role.entity.js';
import { EUserBackend } from './users/user.entity.js';

export const EntityList = [
  EImageBackend,
  EImageFileBackend,
  EImageDerivativeBackend,
  EUserBackend,
  ERoleBackend,
  ESysPreferenceBackend,
  EUsrPreferenceBackend,
  EApiKeyBackend,
  ESystemStateBackend,
];
