import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { ProcessingViewMetadata } from 'src/app/models/processing-view-metadata';
import { ImageService } from 'src/app/services/api/image.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  templateUrl: './processing.component.html',
})
export class ProcessingComponent implements OnInit {
  constructor(
    private router: Router,
    private imageService: ImageService,
    private utilService: UtilService
  ) {}

  async ngOnInit() {
    const state = history.state as ProcessingViewMetadata;
    if (!state) {
      return this.utilService.quitError('Error');
    }

    history.replaceState(null, '');

    const hash = await this.imageService.UploadImage(state.imageFile);
    if (HasFailed(hash)) {
      return this.utilService.quitError(hash.getReason());
    }

    this.router.navigate([`/view/`, hash], { replaceUrl: true });
  }
}
