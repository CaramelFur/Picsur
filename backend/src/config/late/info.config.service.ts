import { Injectable, Logger } from '@nestjs/common';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service.js';

@Injectable()
export class InfoConfigService {
  private readonly logger = new Logger(InfoConfigService.name);

  constructor(private readonly prefService: SysPreferenceDbService) {}

  public async getHostnameOverride(): Promise<string | undefined> {
    const hostname = await this.prefService.getStringPreference(
      SysPreference.HostOverride,
    );
    if (HasFailed(hostname)) {
      hostname.print(this.logger);
      return undefined;
    }

    if (hostname === '') return undefined;

    return hostname;
  }
}
