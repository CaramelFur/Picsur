import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LOCATION, NAVIGATOR, WINDOW } from '@ng-web-apis/common';
import { Logger } from '../logger/logger.service';

type UmamiCollectType = 'pageview' | 'event';

interface UmamiBasePayload {
  website: string;
  hostname: string;
  screen: string;
  language: string;
  url: string;
}

interface UmamiPayload {
  pageview: UmamiBasePayload & {
    referer: string;
  };
  event: UmamiBasePayload & {
    event_name: string;
    event_data?: string;
  };
}

type FunctionOnly<O> = {
  [K in keyof O]: O[K] extends (...args: any) => any ? O[K] : never;
};

const hook = <T, FT extends FunctionOnly<T>, M extends keyof FT>(
  self: FT,
  method: M,
  callback: (...args: Parameters<FT[M]>) => any,
): FT[M] => {
  const orig = self[method];

  return ((...args: Parameters<FT[M]>) => {
    callback(...args);

    return orig.apply(self, args);
  }) as FT[M];
};

@Injectable({
  providedIn: 'root',
})
export class UmamiService {
  private readonly logger = new Logger(UmamiService.name);

  private doNotTrack = false;

  private SITE_ID = '8dd2491e-1984-4f22-9f41-ca880e630ffe';
  private REPORT_URL = 'http://localhost:3000/api/collect';

  private umami_cache: string = '';

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    @Inject(LOCATION) private readonly location: Location,
  ) {
    //this.doNotTrack =
    //  this.navigator.doNotTrack === '1' || this.navigator.doNotTrack === 'yes';

    if (this.doNotTrack) this.logger.warn('Do not track is enabled');

    this.setup();
  }

  private async setup() {
    if (this.doNotTrack) return;

    const { history } = this.window;
    history.pushState = hook(history, 'pushState', this.handlePush.bind(this));
    history.replaceState = hook(
      history,
      'replaceState',
      this.handlePush.bind(this),
    );

    const update = async () => {
      if (document.readyState !== 'complete') return;
      await this.trackView();
    };

    document.addEventListener('readystatechange', update, true);
    await update();
  }

  public async sendEvent(event: string, data?: string) {
    if (this.doNotTrack) return;
    return await this.trackEvent(event, data);
  }

  private async handlePush(
    data: any,
    unused: string,
    url?: string | URL | null,
  ) {
    if (!url) return;

    let currentUrl = this.currentUrl;
    const referrer = currentUrl;
    const newUrl = url.toString();

    if (newUrl.substring(0, 4) === 'http') {
      currentUrl = '/' + newUrl.split('/').splice(3).join('/');
    } else {
      currentUrl = newUrl;
    }

    if (currentUrl === referrer) return;

    return await this.trackView(currentUrl, referrer);
  }

  private getPayload(): UmamiBasePayload {
    const { hostname } = this.location;
    const screen = `${this.window.screen.width}x${this.window.screen.height}`;
    const { language } = this.navigator;

    return {
      website: this.SITE_ID,
      hostname,
      screen,
      language,
      url: this.currentUrl,
    };
  }

  private async collect<T extends UmamiCollectType>(
    type: T,
    payload: UmamiPayload[T],
  ) {
    return this.window
      .fetch(this.REPORT_URL, {
        method: 'POST',
        body: JSON.stringify({ type, payload }),
        headers: {
          'Content-Type': 'application/json',
          ['x-umami-cache']: this.umami_cache,
        },
      })
      .then((res) => res.text())
      .then((text) => (this.umami_cache = text));
  }

  private async trackView(url?: string, referrer?: string) {
    url = url || this.currentUrl;
    referrer = referrer ?? this.document.referrer;
    return this.collect('pageview', {
      ...this.getPayload(),
      url,
      referer: referrer,
    });
  }

  private async trackEvent(event: string, data?: string) {
    return this.collect('event', {
      ...this.getPayload(),
      event_name: event,
      event_data: data,
    });
  }

  private get currentUrl() {
    return this.location.pathname + this.location.search;
  }
}
