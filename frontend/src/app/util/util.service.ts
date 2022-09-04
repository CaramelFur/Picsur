import { Inject, Injectable } from '@angular/core';
import { LOCATION } from '@ng-web-apis/common';
import { FileType2Ext, SupportedFileTypes } from 'picsur-shared/dist/dto/mimes.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { Logger } from '../services/logger/logger.service';

@Injectable({
  providedIn: 'any',
})
export class UtilService {
  private readonly logger = new Logger(UtilService.name);

  constructor(@Inject(LOCATION) private readonly location: Location) {}

  public getHost(): string {
    return this.location.protocol + '//' + this.location.host;
  }

  public downloadBuffer(
    buffer: ArrayBuffer | string,
    filename: string,
    filetype: string = 'application/octet-stream',
  ) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([buffer], { type: filetype }),
    );
    a.download = filename;
    a.target = '_self';
    a.click();
  }

  public getBaseFormatOptions() {
    let newOptions: {
      value: string;
      key: string;
    }[] = [];

    newOptions.push(
      ...SupportedFileTypes.map((mime) => {
        let ext = FileType2Ext(mime);
        if (HasFailed(ext)) ext = 'Error';
        return {
          value: ext.toUpperCase(),
          key: mime,
        };
      }),
    );

    return newOptions;
  }

  public async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
