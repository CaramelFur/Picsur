import { Inject, Injectable } from '@angular/core';
import { LOCATION } from '@ng-web-apis/common';
import { InfoResponse } from 'picsur-shared/dist/dto/api/info.dto';
import {
  AsyncFailable,
  Fail,
  FT,
  HasFailed,
} from 'picsur-shared/dist/types/failable';
import { SemVerRegex } from 'picsur-shared/dist/util/common-regex';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import pkg from '../../../../package.json';
import { ServerInfo } from '../../models/dto/server-info.dto';
import { Logger } from '../logger/logger.service';
import { InfoStorageService } from '../storage/info-storage.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private readonly logger = new Logger(InfoService.name);

  public get live() {
    return this.infoSubject;
  }

  public get snapshot() {
    return this.infoSubject.value;
  }

  private infoSubject: BehaviorSubject<ServerInfo>;
  constructor(
    @Inject(LOCATION) private readonly location: Location,
    private readonly api: ApiService,
    private readonly infoStorage: InfoStorageService,
  ) {
    this.updateInfo().catch((e) => this.logger.warn(e));
    this.infoSubject = new BehaviorSubject<ServerInfo>(
      this.infoStorage?.get() ?? new ServerInfo(),
    );
  }

  public async getLoadedSnapshot(): Promise<ServerInfo> {
    if (this.isLoaded()) {
      return this.snapshot;
    }

    return new Promise((resolve) => {
      const filtered = this.live.pipe(
        filter((info) => info.version !== '0.0.0'),
        take(1),
      );
      (filtered as Observable<ServerInfo>).subscribe(resolve);
    });
  }

  public getFrontendVersion(): string {
    return pkg.version;
  }

  public getHostname(allowOverride = false): string {
    if (allowOverride) {
      const info = this.snapshot;

      if (info.host_override !== undefined) {
        return info.host_override;
      }
    }

    return this.location.protocol + '//' + this.location.host;
  }

  // If either version starts with 0. it has to be exactly the same
  // If both versions start with something else, they have to match the first part
  public async isCompatibleWithServer(): AsyncFailable<boolean> {
    const info = await this.getLoadedSnapshot();
    if (HasFailed(info)) return info;

    const serverVersion = info.version;
    const clientVersion = this.getFrontendVersion();

    if (!SemVerRegex.test(serverVersion) || !SemVerRegex.test(clientVersion)) {
      return Fail(
        FT.SysValidation,
        `Not a valid semver: ${serverVersion} or ${clientVersion}`,
      );
    }

    const serverDecoded = serverVersion.split('.');
    const clientDecoded = clientVersion.split('.');

    if (serverDecoded[0] === '0' || clientDecoded[0] === '0') {
      if (serverVersion !== clientVersion) {
        return false;
      } else {
        return true;
      }
    } else {
      return serverDecoded[0] === clientDecoded[0];
    }
  }

  public isLoaded(): boolean {
    return this.snapshot.version !== '0.0.0';
  }

  private async updateInfo(): AsyncFailable<ServerInfo> {
    const response = await this.api.get(InfoResponse, '/api/info').result;
    if (HasFailed(response)) return response;

    this.infoSubject.next(response);
    this.infoStorage.set(response);
    return response;
  }
}
