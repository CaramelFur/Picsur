import { Injectable } from '@angular/core';
import { ServerInfo } from '../../models/dto/server-info.dto';
import { Logger } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class InfoStorageService {
  private readonly logger = new Logger(InfoStorageService.name);

  private readonly storageKey = 'server-info';
  private info: ServerInfo | null = null;

  constructor() {
    this.load();
  }

  private load() {
    try {
      const hasRead = localStorage.getItem(this.storageKey);
      if (hasRead === null) return;

      this.info = JSON.parse(hasRead);
    } catch (e) {
      this.logger.warn(e);
      localStorage.removeItem(this.storageKey);
    }
  }

  private store() {
    if (this.info)
      localStorage.setItem(this.storageKey, JSON.stringify(this.info));
    else localStorage.removeItem(this.storageKey);
  }

  public get() {
    setTimeout(this.load.bind(this), 0);
    return this.info;
  }

  public set(info: ServerInfo) {
    this.info = info;
    this.store();
  }

  public clear() {
    this.info = null;
    this.store();
  }
}
