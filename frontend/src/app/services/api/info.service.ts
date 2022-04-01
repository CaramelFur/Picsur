import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { isSemVer } from 'class-validator';
import { InfoResponse } from 'picsur-shared/dist/dto/api/info.dto';
import {
  AsyncFailable,
  Fail,
  Failable,
  HasFailed
} from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from 'src/app/util/util.service';
import pkg from '../../../../package.json';
import { ServerInfo } from '../../models/dto/server-info.dto';
import { Logger } from '../logger/logger.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private readonly logger = new Logger('InfoService');

  public get live() {
    return this.infoSubject;
  }

  private infoSubject = new BehaviorSubject<ServerInfo>(new ServerInfo());

  constructor(private api: ApiService, private utilService: UtilService) {
    this.pollInfo()
      .then(() => {
        this.checkCompatibility();
      })
      .catch(this.logger.error);
  }

  public async pollInfo(): AsyncFailable<ServerInfo> {
    const response = await this.api.get(InfoResponse, '/api/info');
    if (HasFailed(response)) return response;

    const info = plainToClass(ServerInfo, response);

    this.infoSubject.next(info);
    return info;
  }

  public getFrontendVersion(): string {
    return pkg.version;
  }

  // If either version starts with 0. it has to be exactly the same
  // If both versions start with something else, they have to match the first part
  public isCompatibleWithServer(): Failable<boolean> {
    const info = this.infoSubject.getValue();
    if (HasFailed(info)) return info;

    const serverVersion = info.version;
    const clientVersion = this.getFrontendVersion();

    console.log(serverVersion, clientVersion);

    if (!isSemVer(serverVersion) || !isSemVer(clientVersion)) {
      return Fail(`Not a valid semver: ${serverVersion} or ${clientVersion}`);
    }

    const serverDecoded = serverVersion.split('.');
    const clientDecoded = clientVersion.split('.');

    if (serverDecoded[0] === '0' || clientDecoded[0] === '0') {
      if (serverVersion !== clientVersion) {
        console.log('a');
        return false;
      } else {
        return true;
      }
    } else {
      console.log('b');
      return serverDecoded[0] === clientDecoded[0];
    }
  }

  private checkCompatibility(): void {
    const isCompatible = this.isCompatibleWithServer();

    if (HasFailed(isCompatible) || !isCompatible) {
      this.utilService
        .showDialog({
          title: 'Server is not compatible',
          description:
            'The server is not compatible with this version of the client. You can ignore this, but expect things to not work.',
          buttons: [
            {
              text: 'Back',
              name: 'back',
              color: 'green',
            },
            {
              text: 'Ignore',
              name: 'ignore',
              color: 'warn',
            },
          ],
        })
        .then((button) => {
          if (button === 'ignore') {
            this.logger.warn('Ignoring server compatibility');
          } else {
            this.checkCompatibility();
            // Go to previous page
            window.history.back();
          }
        });
    }
  }
}
