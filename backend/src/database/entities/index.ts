import { EApiKeyBackend } from './apikey.entity';
import { EImageDerivativeBackend } from './image-derivative.entity';
import { EImageFileBackend } from './image-file.entity';
import { EImageBackend } from './image.entity';
import { ERoleBackend } from './role.entity';
import { ESysPreferenceBackend } from './sys-preference.entity';
import { ESystemStateBackend } from './system-state.entity';
import { EUserBackend } from './user.entity';
import { EUsrPreferenceBackend } from './usr-preference.entity';

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
