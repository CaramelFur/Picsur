import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { ProcessingViewMeta } from 'src/app/models/dto/processing-view-meta.dto';
import { ImageService } from 'src/app/services/api/image.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';

@Component({
  templateUrl: './processing.component.html',
})
export class ProcessingComponent implements OnInit {
  private readonly logger = new Logger(ProcessingComponent.name);

  constructor(
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
  ) {}

  async ngOnInit() {
    const state = history.state as ProcessingViewMeta;
    if (!state) {
      return this.errorService.quitFailure(
        Fail(FT.UsrValidation, 'No state provided'),
        this.logger,
      );
    }

    history.replaceState(null, '');

    const id = await this.imageService.UploadImage(state.imageFile);
    if (HasFailed(id))
      return this.errorService.quitFailure(id, this.logger);

    this.router.navigate([`/view/`, id], { replaceUrl: true });
  }
}
