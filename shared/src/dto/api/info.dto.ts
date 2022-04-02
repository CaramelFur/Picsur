import { IsBoolean, IsSemVer } from 'class-validator';
import { IsStringList } from '../../validators/string-list.validator';

export class InfoResponse {
  @IsBoolean()
  production: boolean;

  @IsBoolean()
  demo: boolean;

  @IsSemVer()
  version: string;
}

// AllPermissions
export class AllPermissionsResponse {
  @IsStringList()
  permissions: string[];
}
