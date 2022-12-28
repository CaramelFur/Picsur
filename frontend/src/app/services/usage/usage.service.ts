import { Inject, Injectable } from '@angular/core';
import { NAVIGATOR } from '@ng-web-apis/common';
import type { AckeeInstance, AckeeTrackingReturn } from 'ackee-tracker';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { TrackingState } from 'picsur-shared/dist/dto/tracking-state.enum';
import { InfoService } from '../api/info.service';
import { Logger } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  private doNotTrack = false;

  private instance?: AckeeInstance;
  private tracker?: AckeeTrackingReturn;

  constructor(
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    private readonly hostInfo: InfoService,
  ) {
    this.doNotTrack =
      this.navigator.doNotTrack === '1' || this.navigator.doNotTrack === 'yes';

    if (this.doNotTrack) {
      this.logger.verbose('Usage reporting disabled by DNT');
      return;
    }

    this.subscribeInfo();
  }

  @AutoUnsubscribe()
  private subscribeInfo() {
    return this.hostInfo.live.subscribe((info) => {
      if (
        info.tracking.state === TrackingState.Disabled ||
        info.tracking.id === undefined
      ) {
        this.stop();
      } else {
        this.setup(
          info.tracking.state === TrackingState.Detailed,
          info.tracking.id,
        );
      }
    });
  }

  private async setup(detailed: boolean, id: string) {
    this.logger.verbose(
      `Tracking enabled with detailed=${detailed} and id=${id}`,
    );

    if (!this.instance) {
      const ackee = await import('ackee-tracker');
      this.instance = ackee.create('/api/usage/report', {
        ignoreLocalhost: false,
        ignoreOwnVisits: false,
        detailed,
      });
    }

    if (this.tracker) {
      this.stop();
    }
    this.tracker = this.instance.record(id);
  }

  private async stop() {
    this.tracker?.stop();
    this.tracker = undefined;
  }
}
