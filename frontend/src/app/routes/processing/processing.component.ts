import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fail, FT, HasFailed } from 'picsur-shared/dist/types/failable';
import { ProcessingViewMeta } from '../../models/dto/processing-view-meta.dto';
import { ApiService } from '../../services/api/api.service';
import { ImageService } from '../../services/api/image.service';
import { Logger } from '../../services/logger/logger.service';
import { ErrorService } from '../../util/error-manager/error.service';

@Component({
  templateUrl: './processing.component.html',
})
export class ProcessingComponent implements OnInit {
  private readonly logger = new Logger(ProcessingComponent.name);

  constructor(
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
    private readonly apiService: ApiService,
  ) {}

  async ngOnInit() {
    const state = history.state as ProcessingViewMeta;
    if (!ProcessingViewMeta.is(state)) {
      return this.errorService.quitFailure(
        Fail(FT.UsrValidation, 'No state provided'),
        this.logger,
      );
    }

    history.replaceState(null, '');

    const id = await this.imageService.UploadImage(state.imageFiles[0]);

    if (HasFailed(id)) return this.errorService.quitFailure(id, this.logger);

    this.router.navigate([`/view/`, id], { replaceUrl: true });
  }
}
