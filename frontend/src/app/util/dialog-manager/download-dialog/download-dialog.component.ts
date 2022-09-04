import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DownloadDialogData {
  name: string;
}

@Component({
  selector: 'download-dialog',
  templateUrl: './download-dialog.component.html',
})
export class DownloadDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<DownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: DownloadDialogData,
  ) {}
}
