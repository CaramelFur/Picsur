import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessingViewMetadata } from 'src/app/models/processing-view-metadata';
import { ImageService } from 'src/app/api/image.service';
import { HasFailed } from 'picsur-shared/dist/types';

@Component({
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss'],
})
export class ProcessingComponent implements OnInit {
  constructor(private router: Router, private imageService: ImageService) {}

  async ngOnInit() {
    const state = history.state as ProcessingViewMetadata;
    if (!state) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    history.replaceState(null, '');

    const hash = await this.imageService.UploadImage(state.imageFile);
    if (HasFailed(hash)) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }

    this.router.navigate([`/view/`, hash], { replaceUrl: true });
  }
}
