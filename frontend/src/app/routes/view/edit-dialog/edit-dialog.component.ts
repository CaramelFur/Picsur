import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { ImageService } from 'src/app/services/api/image.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';

export interface EditDialogData {
  image: EImage;
}

@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  private readonly logger = new Logger(EditDialogComponent.name);

  public readonly ExpireOptions: Array<[string, null | number]> = [
    ['Never', 0],
    ['5 Minutes', 5 * 60],
    ['10 Minutes', 10 * 60],
    ['30 Minutes', 15 * 60],
    ['1 Hour', 60 * 60],
    ['6 Hours', 2 * 60 * 60],
    ['12 Hours', 12 * 60 * 60],
    ['1 Day', 24 * 60 * 60],
    ['1 Week', 7 * 24 * 60 * 60],
    ['1 Month', 30 * 24 * 60 * 60],
  ];

  public expiresAfter: number = 0;
  public image: EImage;

  constructor(
    public readonly dialogRef: MatDialogRef<EditDialogComponent>,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) data: EditDialogData,
  ) {
    if (!data.image) {
      throw new Error('imageID is required');
    }

    this.image = data.image;
  }

  async ngOnInit() {
    console.log(this.image);
  }

  close() {
    this.dialogRef.close(null);
  }

  async save() {
    const result = await this.imageService.UpdateImage(this.image.id, {
      file_name: this.image.file_name,
      expires_at:
        this.expiresAfter === 0
          ? null
          : new Date(Date.now() + this.expiresAfter * 1000),
    });

    if (HasFailed(result)) {
      this.errorService.showFailure(result, this.logger);
      return this.close();
    }

    this.errorService.success('Image successfully updated');

    this.dialogRef.close(result);
  }
}
