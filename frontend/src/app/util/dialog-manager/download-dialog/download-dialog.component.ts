import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface DownloadDialogData {
  name: string;
  progress?: Observable<number>;
}

@Component({
  selector: 'download-dialog',
  templateUrl: './download-dialog.component.html',
})
export class DownloadDialogComponent {
  public progress: Observable<number>;

  constructor(
    public readonly dialogRef: MatDialogRef<DownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: DownloadDialogData,
  ) {
    this.progress = data.progress ?? new Observable<number>();
  }
}
