import { IsBoolean, IsDefined, IsSemVer, IsString } from 'class-validator';
import { IsStringList } from '../../validators/string-list.validator';

export class InfoResponse {
  @IsBoolean()
  @IsDefined()
  production: boolean;

  @IsBoolean()
  @IsDefined()
  demo: boolean;

  @IsDefined()
  @IsString()
  @IsSemVer()
  version: string;
}

// AllPermissions
export class AllPermissionsResponse {
  @IsDefined()
  @IsStringList()
  Permissions: string[];
}
