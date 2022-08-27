import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FileType, ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { URLRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseMime2FileType } from 'picsur-shared/dist/util/parse-mime';
import { ApiService } from 'src/app/services/api/api.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { QoiWorkerService } from 'src/app/workers/qoi-worker.service';

enum PicsurImgState {
  Loading = 'loading',
  Canvas = 'canvas',
  Image = 'image',
  Error = 'error',
}

@Component({
  selector: 'picsur-img',
  templateUrl: './picsur-img.component.html',
  styleUrls: ['./picsur-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicsurImgComponent implements OnChanges {
  private readonly logger = new Logger('ZodImgComponent');

  @ViewChild('targetcanvas') private canvas: ElementRef<HTMLCanvasElement>;

  private isInView = false;

  @Input('src') imageURL: string | undefined;

  public state: PicsurImgState = PicsurImgState.Loading;

  constructor(
    private readonly qoiWorker: QoiWorkerService,
    private readonly apiService: ApiService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInView) this.reload();
  }

  private reload() {
    let url = this.imageURL ?? '';
    if (!URLRegex.test(url)) {
      this.state = PicsurImgState.Loading;
      this.changeDetector.markForCheck();
      return;
    }

    this.update(url)
      .then((result) => {
        if (HasFailed(result)) {
          this.state = PicsurImgState.Error;
          this.logger.error(result.getReason());
        }
      })
      .catch((e) => this.logger.error);
  }

  private async update(url: string): AsyncFailable<void> {
    const filetype = await this.getFileType(url);
    if (HasFailed(filetype)) return filetype;

    if (filetype.identifier === ImageFileType.QOI) {
      const result = await this.qoiWorker.decode(url);
      if (HasFailed(result)) return result;

      const canvas = this.canvas.nativeElement;
      canvas.height = result.height;
      canvas.width = result.width;
      canvas.getContext('2d')?.putImageData(result.data, 0, 0);

      this.state = PicsurImgState.Canvas;
    } else {
      this.state = PicsurImgState.Image;
    }
    this.changeDetector.markForCheck();
  }

  private async getFileType(url: string): AsyncFailable<FileType> {
    const response = await this.apiService.head(url);
    if (HasFailed(response)) {
      return response;
    }

    const mimeHeader = response.get('content-type') ?? '';
    const mime = mimeHeader.split(';')[0];

    return ParseMime2FileType(mime);
  }

  onInview(e: any) {
    this.isInView = true;

    if (this.state === PicsurImgState.Loading) {
      this.reload();
    }
  }

  onOutview(e: any) {
    this.isInView = false;
  }
}
