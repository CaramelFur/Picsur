import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fail, Failable, FT, HasFailed } from 'picsur-shared/dist/types';
import { ProcessingViewMeta } from 'src/app/models/dto/processing-view-meta.dto';
import { ApiService } from 'src/app/services/api/api.service';
import { ImageService } from 'src/app/services/api/image.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';

enum ProcessingState {
  Idle = 'idle',
  Uploading = 'uploading',
  Processing = 'processing',
}

@Component({
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss'],
})
export class ProcessingComponent implements OnInit, OnDestroy {
  private readonly logger = new Logger(ProcessingComponent.name);

  public state = ProcessingState.Idle;
  public progress = -1;
  public poller?: number;

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

    const request = this.imageService.UploadImages(state.imageFiles);
    request.progress.subscribe((progress) => {
      this.progress = progress;
    });
    this.state = ProcessingState.Uploading;

    const result = await request.result;
    if (HasFailed(result)) {
      return this.errorService.quitFailure(result, this.logger);
    }
    this.logger.debug('Upload finished');

    this.state = ProcessingState.Processing;
    this.progress = -1;

    const jobIds = result.map((v) => v.job_id);

    this.poller = window.setInterval(async () => {
      const progress = await this.imageService.GetUploadProgress(jobIds);
      if (HasFailed(progress)) {
        return this.errorService.showFailure(progress, this.logger);
      }

      this.progress = progress;
      if (progress === 1) {
        if (this.poller) {
          clearInterval(this.poller);
        }
        this.router.navigate(['/']);
      }
    }, 1000);

    // if (HasFailed(id)) return this.errorService.quitFailure(id, this.logger);

    // this.router.navigate([`/view/`, id], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    if (this.poller) {
      clearInterval(this.poller);
    }
    if (this.state === ProcessingState.Idle) return;

    this.errorService.info('Upload continued in background');
  }
}
