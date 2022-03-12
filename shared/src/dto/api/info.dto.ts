import { IsDefined } from 'class-validator';

export class InfoResponse {
  @IsDefined()
  production: boolean;

  @IsDefined()
  demo: boolean;
}
