import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { ApiService } from 'src/app/services/api/api.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { SnackBarType } from '../../models/dto/snack-bar-type.dto';
import { BootstrapService, BSScreenSize } from './bootstrap.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';
import { DownloadDialogComponent } from './download-dialog/download-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private readonly logger = new Logger('UtilService');

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private api: ApiService,
    private bootstrap: BootstrapService,
  ) {}

  public quitError(message: string) {
    this.showSnackBar(message, SnackBarType.Error);
    this.router.navigate(['/']);
  }

  public showSnackBar(
    message: string,
    type: SnackBarType = SnackBarType.Default,
    duration: number | undefined | null = null,
  ) {
    let ref = this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'snackbar', type],
      verticalPosition:
        this.bootstrap.screenSizeSnapshot() > BSScreenSize.xs
          ? 'bottom'
          : 'top',
      ...(duration !== null ? { duration } : {}),
    });
  }

  public async showCustomDialog<T>(
    component: ComponentType<T>,
    data: any,
    options?: {
      dismissable?: boolean;
    },
  ): Promise<any | undefined> {
    return new Promise((resolve, reject) => {
      const ref = this.dialog.open(component, {
        data,
        panelClass: 'small-dialog-padding',
        ...(options?.dismissable === false
          ? {}
          : { disableClose: true, closeOnNavigation: false }),
      });
      const subscription = ref.beforeClosed().subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  public async showDialog(
    options: ConfirmDialogData,
  ): Promise<string | undefined> {
    return this.showCustomDialog(ConfirmDialogComponent, options);
  }

  public showDownloadDialog(filename: string): () => void {
    const ref = this.dialog.open(DownloadDialogComponent, {
      data: { name: filename },
      disableClose: true,
      closeOnNavigation: false,
    });

    return () => ref.close();
  }

  public async downloadFile(url: string) {
    const closeDialog = this.showDownloadDialog('image');

    const file = await this.api.getBuffer(url);
    if (HasFailed(file)) {
      closeDialog();
      this.logger.error(file.getReason());
      this.showSnackBar('Error while downloading image', SnackBarType.Error);
      return;
    }

    // Download with the browser
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([file.buffer], { type: file.mimeType }),
    );
    a.download = file.name;
    a.target = '_self';
    a.click();

    closeDialog();
    this.showSnackBar('Image downloaded', SnackBarType.Info);
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
    if (!this.canShare()) {
      this.showSnackBar(
        'Sharing is not supported on your device',
        SnackBarType.Warning,
      );
      return;
    }

    let shareObject: ShareData;

    if (!this.canShareFiles()) {
      shareObject = {
        url,
      };
    } else {
      const image = await this.api.getBuffer(url);
      if (HasFailed(image)) {
        this.logger.error(image.getReason());
        this.showSnackBar('Error while sharing image', SnackBarType.Error);
        return;
      }

      this.logger.log(image.name, image.mimeType);

      const imageFile = new File([image.buffer], image.name, {
        type: image.mimeType,
      });

      shareObject = {
        files: [imageFile],
      };
    }

    const canShare = navigator.canShare(shareObject);
    if (!canShare) {
      this.showSnackBar(
        'Sharing is not supported on your device',
        SnackBarType.Warning,
      );
      return;
    }

    try {
      await navigator.share(shareObject);
    } catch (e) {
      if (e instanceof DOMException && e.message === 'Share canceled') {
      } else {
        this.logger.error(e);
        this.showSnackBar('Could not share', SnackBarType.Error);
      }
    }
  }

  public async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
