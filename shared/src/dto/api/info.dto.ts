import { IsBoolean, IsDefined } from 'class-validator';

export class InfoResponse {
  @IsBoolean()
  @IsDefined()
  production: boolean;

  @IsBoolean()
  @IsDefined()
  demo: boolean;
}
