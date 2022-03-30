import { Injectable } from '@angular/core';
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

  private storage: Storage;

  constructor() {
    if (window.sessionStorage) {
      this.storage = window.sessionStorage;
    } else {
      throw new Error('Session storage is not supported');
    }
  }

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
