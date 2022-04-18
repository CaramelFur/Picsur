import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HasFailed } from 'picsur-shared/dist/types';
import { ProcessingViewMeta } from 'src/app/models/dto/processing-view-meta.dto';
import { ImageService } from 'src/app/services/api/image.service';
import { UtilService } from 'src/app/util/util-module/util.service';

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
    const state = history.state as ProcessingViewMeta;
    if (!state) {
      return this.utilService.quitError('Error');
    }

    history.replaceState(null, '');

    const id = await this.imageService.UploadImage(state.imageFile);
    if (HasFailed(id)) {
      return this.utilService.quitError(id.getReason());
    }

    this.router.navigate([`/view/`, id], { replaceUrl: true });
  }
}
