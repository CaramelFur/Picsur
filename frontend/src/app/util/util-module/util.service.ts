import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { HasFailed } from 'picsur-shared/dist/types';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { SnackBarType } from '../../models/dto/snack-bar-type.dto';
import {
  ConfirmDialogComponent,
  DialogData
} from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private readonly logger = new Logger('UtilService');

  private isDesktopObservable: Observable<boolean>;
  private isDesktopVariable: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private breakPointObserver: BreakpointObserver,
    private api: ApiService
  ) {
    this.isDesktopObservable = this.breakPointObserver
      .observe(['(min-width: 576px)']) // Bootstrap breakpoints
      .pipe(map((result) => result.matches));

    this.subscribeToIsDesktop();
  }

  @AutoUnsubscribe()
  private subscribeToIsDesktop() {
    return this.isDesktopObservable.subscribe((isDesktop) => {
      this.isDesktopVariable = isDesktop;
    });
  }

  public quitError(message: string) {
    this.showSnackBar(message, SnackBarType.Error);
    this.router.navigate(['/']);
  }

  public isDesktop(): Observable<boolean> {
    return this.isDesktopObservable;
  }

  public isMobile(): Observable<boolean> {
    return this.isDesktopObservable.pipe(map((isDesktop) => !isDesktop));
  }

  public isDesktopSnapshot(): boolean {
    return this.isDesktopVariable;
  }

  public isMobileSnapshot(): boolean {
    return !this.isDesktopVariable;
  }

  public showSnackBar(
    message: string,
    type: SnackBarType = SnackBarType.Default,
    duration: number | undefined | null = null
  ) {
    let ref = this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'snackbar', type],
      verticalPosition: this.isDesktopSnapshot() ? 'bottom' : 'top',
      ...(duration !== null ? { duration } : {}),
    });
  }

  public async showDialog(options: DialogData): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: options,
        disableClose: true,
      });
      const subscription = ref.beforeClosed().subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  public downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() ?? '';
    link.click();

    link.remove();
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

  public async shareLink(url: string) {
    if (!this.canShare()) {
      this.showSnackBar(
        'Sharing is not supported on your device',
        SnackBarType.Warning
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
        SnackBarType.Warning
      );
      return;
    }

    try {
      await navigator.share(shareObject);
    } catch (e) {
      if (e instanceof DOMException && e.message === 'Share canceled') {
      } else {
        this.logger.error(e);
        this.showSnackBar(
          'An error occured while sharing the image',
          SnackBarType.Error
        );
      }
    }
  }

  public async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
