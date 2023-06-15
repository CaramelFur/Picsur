import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageService } from '../../../services/api/image.service';

export interface CustomizeDialogData {
  imageID: string;
  formatOptions: {
    value: string;
    key: string;
  }[];
  selectedFormat: string;
}

@Component({
  selector: 'customize-dialog',
  templateUrl: './customize-dialog.component.html',
  styleUrls: ['./customize-dialog.component.scss'],
})
export class CustomizeDialogComponent {
  public sizeTooltip = 'Leave empty to keep original aspect ratio';

  public rotationOptions = [0, 90, 180, 270];
  public formatOptions: {
    value: string;
    key: string;
  }[];

  public imageID: string;
  public selectedFormat: string;
  public height: number;
  public width: number;
  public rotate: number;
  public flipx: boolean;
  public flipy: boolean;
  public shrinkonly: boolean;
  public greyscale: boolean;
  public noalpha: boolean;
  public negative: boolean;
  public quality: number;

  constructor(
    public readonly dialogRef: MatDialogRef<CustomizeDialogComponent>,
    private readonly imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) data: CustomizeDialogData,
  ) {
    this.formatOptions = data.formatOptions;
    this.selectedFormat = data.selectedFormat;
    this.imageID = data.imageID;
  }

  close() {
    this.dialogRef.close();
  }

  getURL(): string {
    return this.imageService.GetImageURLCustomized(
      this.imageID,
      this.selectedFormat,
      {
        height: this.height ?? undefined,
        width: this.width ?? undefined,
        rotate: this.rotate ?? undefined,
        quality: this.quality ?? undefined,
        flipx: this.flipx,
        flipy: this.flipy,
        shrinkonly: this.shrinkonly,
        greyscale: this.greyscale,
        noalpha: this.noalpha,
        negative: this.negative,
      },
    );
  }
}
