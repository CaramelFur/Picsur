import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE } from '@ng-web-apis/common';
import { AsyncFailable, Failable, HasFailed } from 'picsur-shared/dist/types';

interface dataWrapper<T> {
  data: T;
  expires: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly cacheExpiresMS = 1000 * 60 * 60;

  constructor(@Inject(SESSION_STORAGE) private readonly storage: Storage) {}

  public set<T>(key: string, value: T): void {
    const data: dataWrapper<T> = {
      data: value,
      expires: Date.now() + this.cacheExpiresMS,
    };

    this.storage.setItem(key, JSON.stringify(data));
  }

  public get<T>(key: string): T | null {
    try {
      const data: dataWrapper<T> = JSON.parse(this.storage.getItem(key) ?? '');
      if (data && data.data && data.expires > Date.now()) {
        return data.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  public async getFallback<T>(
    key: string,
    finalFallback: T,
    ...fallbacks: Array<(key: string) => AsyncFailable<T> | Failable<T>>
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    for (const fallback of fallbacks) {
      const result = await fallback(key);
      if (HasFailed(result)) {
        continue;
      }

      this.set(key, result);
      return result;
    }

    return finalFallback;
  }
}
