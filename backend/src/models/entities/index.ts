import { EImageFileBackend } from './image-file.entity';
import { EImageBackend } from './image.entity';
import { ERoleBackend } from './role.entity';
import { ESysPreferenceBackend } from './sys-preference.entity';
import { EUserBackend } from './user.entity';
import { EUsrPreferenceBackend } from './usr-preference.entity';

export const EntityList = [
  EImageBackend,
  EImageFileBackend,
  EUserBackend,
  ERoleBackend,
  ESysPreferenceBackend,
  EUsrPreferenceBackend,
];
