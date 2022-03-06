import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { UtilService } from 'src/app/util/util.service';
import { ProcessingViewMetadata } from '../../models/processing-view-metadata';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  constructor(private utilService: UtilService, private router: Router) {}
  onSelect(event: NgxDropzoneChangeEvent) {
    if (event.addedFiles.length > 1) {
      this.utilService.showSnackBar(
        'You uploaded multiple images, only one has been uploaded'
      );
    }

    const metadata: ProcessingViewMetadata = {
      imageFile: event.addedFiles[0],
    };
    this.router.navigate(['/processing'], { state: metadata });
  }
}
