import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FileType, ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types/failable';
import { URLRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseMime2FileType } from 'picsur-shared/dist/util/parse-mime';
import { ApiService } from '../../services/api/api.service';
import { Logger } from '../../services/logger/logger.service';
import { QoiWorkerService } from '../../workers/qoi-worker.service';

enum PicsurImgState {
  Init = 'init',
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
  private readonly logger = new Logger(PicsurImgComponent.name);

  @ViewChild('targetcanvas') private canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('targetimg') private img: ElementRef<HTMLImageElement>;

  private isInView = false;

  @Input('src') imageURL: string | undefined;

  public state: PicsurImgState = PicsurImgState.Init;

  constructor(
    private readonly qoiWorker: QoiWorkerService,
    private readonly apiService: ApiService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    if (this.isInView) this.reload();
  }

  private reload() {
    const url = this.imageURL ?? '';
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
          this.changeDetector.markForCheck();
        }
      })
      .catch(this.logger.error);
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
      const result = await this.apiService.getBuffer(url).result;
      if (HasFailed(result)) return result;

      const img = this.img.nativeElement;

      const blob = new Blob([result.buffer]);
      img.src = URL.createObjectURL(blob);

      this.state = PicsurImgState.Image;
    }
    this.changeDetector.markForCheck();
  }

  private async getFileType(url: string): AsyncFailable<FileType> {
    const response = await this.apiService.head(url).result;
    if (HasFailed(response)) {
      return response;
    }

    const mimeHeader = response['content-type'] ?? '';
    const mime = mimeHeader.split(';')[0];

    return ParseMime2FileType(mime);
  }

  onInview() {
    this.isInView = true;

    if (this.state === PicsurImgState.Init) {
      this.state = PicsurImgState.Loading;
      this.changeDetector.markForCheck();

      this.reload();
    }
  }

  onOutview() {
    this.isInView = false;
  }
}
