import { Injectable } from '@angular/core';

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

  public set<T>(key: string, value: T): void {
    const data: dataWrapper<T> = {
      data: value,
      expires: Date.now() + this.cacheExpiresMS,
    };

    this.storage.setItem(key, JSON.stringify(data));
  }
}
