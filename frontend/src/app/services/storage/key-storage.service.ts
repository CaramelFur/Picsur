import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyStorageService {
  private key: string | null = null;

  constructor() {
    this.load();
  }

  private load() {
    this.key = localStorage.getItem('apiKey');
  }

  private store() {
    if (this.key) localStorage.setItem('apiKey', this.key);
    else localStorage.removeItem('apiKey');
  }

  public get() {
    setTimeout(this.load.bind(this), 0);
    return this.key;
  }

  public set(key: string) {
    this.key = key;
    this.store();
  }

  public clear() {
    this.key = null;
    this.store();
  }
}
