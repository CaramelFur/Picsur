import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fail, FT, HasFailed } from 'picsur-shared/dist/types/failable';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { Logger } from '../../services/logger/logger.service';
import { DownloadDialogComponent } from '../dialog-manager/download-dialog/download-dialog.component';
import { ErrorService } from '../error-manager/error.service';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'any',
})
export class DownloadService {
  private readonly logger = new Logger(DownloadService.name);

  constructor(
    private readonly dialog: MatDialog,
    private readonly api: ApiService,
    private readonly util: UtilService,
    private readonly errorService: ErrorService,
  ) {}

  public showDownloadDialog(
    filename: string,
    progress?: Observable<number>,
  ): () => void {
    const ref = this.dialog.open(DownloadDialogComponent, {
      data: { name: filename, progress: progress },
      disableClose: true,
      closeOnNavigation: false,
    });

    return () => ref.close();
  }

  public async downloadFile(url: string) {
    const request = this.api.getBuffer(url);
    const closeDialog = this.showDownloadDialog(
      'image',
      request.downloadProgress,
    );

    const file = await request.result;

    if (HasFailed(file)) {
      closeDialog();
      return this.errorService.showFailure(file, this.logger);
    }

    this.util.downloadBuffer(file.buffer, file.name, file.mimeType);

    closeDialog();

    this.errorService.info('Image downloaded');
  }

  public canShare(): boolean {
    if (navigator.canShare === undefined || navigator.share === undefined)
      return false;

    const testShare = navigator.canShare({
      url: 'https://www.example.com',
    });

    return testShare;
  }

  public canShareFiles(): boolean {
    if (!this.canShare()) return false;

    const testFile = new File([], 'test.txt');
    const testShare = navigator.canShare({
      files: [testFile],
    });

    return testShare;
  }

  public async shareFile(url: string) {
    if (!this.canShare())
      return this.errorService.warn(
        'Sharing is not supported on your device',
        this.logger,
      );

    let shareObject: ShareData;

    if (!this.canShareFiles()) {
      shareObject = {
        url,
      };
    } else {
      const image = await this.api.getBuffer(url).result;
      if (HasFailed(image))
        return this.errorService.showFailure(image, this.logger);

      this.logger.log(image.name, image.mimeType);

      const imageFile = new File([image.buffer], image.name, {
        type: image.mimeType,
      });

      shareObject = {
        files: [imageFile],
      };
    }

    const canShare = navigator.canShare(shareObject);
    if (!canShare)
      return this.errorService.warn(
        'Sharing is not supported on your device',
        this.logger,
      );

    try {
      await navigator.share(shareObject);
    } catch (e) {
      if (e instanceof DOMException && e.message === 'Share canceled') {
      } else {
        this.errorService.showFailure(
          Fail(FT.Internal, 'Sharing failed!', e),
          this.logger,
        );
      }
    }
  }
}
