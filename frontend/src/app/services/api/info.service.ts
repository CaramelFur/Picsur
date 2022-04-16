import { Injectable } from '@angular/core';
import { InfoResponse } from 'picsur-shared/dist/dto/api/info.dto';
import {
  AsyncFailable,
  Fail, HasFailed
} from 'picsur-shared/dist/types';
import { SemVerRegex } from 'picsur-shared/dist/util/common-regex';
import { BehaviorSubject } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
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
    this.checkCompatibility().catch(this.logger.error);
  }

  public async pollInfo(): AsyncFailable<ServerInfo> {
    const response = await this.api.get(InfoResponse, '/api/info');
    if (HasFailed(response)) return response;

    this.infoSubject.next(response);
    return response;
  }

  public getFrontendVersion(): string {
    return pkg.version;
  }

  // If either version starts with 0. it has to be exactly the same
  // If both versions start with something else, they have to match the first part
  public async isCompatibleWithServer(): AsyncFailable<boolean> {
    const info = await this.pollInfo();
    if (HasFailed(info)) return info;

    const serverVersion = info.version;
    const clientVersion = this.getFrontendVersion();

    if (!SemVerRegex.test(serverVersion) || !SemVerRegex.test(clientVersion)) {
      return Fail(`Not a valid semver: ${serverVersion} or ${clientVersion}`);
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

  private async checkCompatibility() {
    const isCompatible = await this.isCompatibleWithServer();

    if (HasFailed(isCompatible)) {
      this.utilService.showSnackBar(
        'There was an error checking compatibility',
        SnackBarType.Warning
      );
      return;
    }

    if (!isCompatible) {
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
