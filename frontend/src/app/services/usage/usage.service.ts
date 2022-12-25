import { Inject, Injectable } from '@angular/core';
import { LOCATION, NAVIGATOR, WINDOW } from '@ng-web-apis/common';
import { Logger } from '../logger/logger.service';
import { InfoService } from '../api/info.service';
import type { AckeeInstance } from 'ackee-tracker';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  private doNotTrack = false;
  private SITE_ID = 'c0fa67c0-fb82-42a7-af7e-ef3df28adeb4';

  private instance?: AckeeInstance;

  constructor(
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    private readonly hostInfo: InfoService,
  ) {
    //this.doNotTrack =
    //  this.navigator.doNotTrack === '1' || this.navigator.doNotTrack === 'yes';
    // TODO: uncomment

    if (this.doNotTrack) this.logger.warn('Do not track is enabled');

    this.setup();
  }

  //dev: boolean, detailed: boolean, id: string
  private async setup() {
    if (this.doNotTrack) return;

    const ackee = await import('ackee-tracker');

    this.instance = ackee.create('/api/usage/report', {
      ignoreLocalhost: false,
      ignoreOwnVisits: false,
      detailed: true,
    });
    this.instance.record(this.SITE_ID);
  }
}
