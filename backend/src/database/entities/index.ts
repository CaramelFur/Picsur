import { EApiKeyBackend } from './apikey.entity';
import { EImageDerivativeBackend } from './images/image-derivative.entity';
import { EImageFileBackend } from './images/image-file.entity';
import { EImageBackend } from './images/image.entity';
import { EIngestFileBackend } from './ingest-file.entity';
import { ESysPreferenceBackend } from './system/sys-preference.entity';
import { ESystemStateBackend } from './system/system-state.entity';
import { EUsrPreferenceBackend } from './system/usr-preference.entity';
import { ERoleBackend } from './users/role.entity';
import { EUserBackend } from './users/user.entity';

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
  EIngestFileBackend,
];
