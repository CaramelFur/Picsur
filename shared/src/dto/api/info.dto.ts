import { IsBoolean, IsDefined, IsSemVer, IsString } from 'class-validator';

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
