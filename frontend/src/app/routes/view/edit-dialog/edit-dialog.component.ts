import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { ImageService } from '../../../services/api/image.service';
import { Logger } from '../../../services/logger/logger.service';
import { ErrorService } from '../../../util/error-manager/error.service';

export interface EditDialogData {
  image: EImage;
}

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent {
  private readonly logger = new Logger(EditDialogComponent.name);

  public readonly ExpireOptions: Array<[string, number]> = [
    ['view.edit.never', 0],
    ['view.edit.fiveMinutes', 5 * 60],
    ['view.edit.tenMinutes', 10 * 60],
    ['view.edit.thirtyMinutes', 30 * 60],
    ['view.edit.oneHour', 60 * 60],
    ['view.edit.sixHours', 2 * 60 * 60],
    ['view.edit.twelveHours', 12 * 60 * 60],
    ['view.edit.oneDay', 24 * 60 * 60],
    ['view.edit.oneWeek', 7 * 24 * 60 * 60],
    ['view.edit.oneMonth', 30 * 24 * 60 * 60],
  ];

  public expiresAfter?: number = undefined;
  public image: EImage;

  constructor(
    public readonly dialogRef: MatDialogRef<EditDialogComponent>,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
    private readonly translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: EditDialogData,
  ) {
    if (!data.image) {
      throw new Error('imageID is required');
    }

    this.image = data.image;
  }

  close() {
    this.dialogRef.close();
  }

  async save() {
    const result = await this.imageService.UpdateImage(this.image.id, {
      file_name: this.image.file_name,
      expires_at: this.getExpiresDate(),
    });

    if (HasFailed(result)) {
      this.errorService.showFailure(result, this.logger);
      return this.close();
    }

    this.errorService.success(this.translateService.instant('images.updated'));

    this.dialogRef.close(result);
  }

  private getExpiresDate() {
    if (this.expiresAfter === undefined) return undefined;
    if (this.expiresAfter === 0) return null;
    return new Date(Date.now() + this.expiresAfter * 1000);
  }
}
