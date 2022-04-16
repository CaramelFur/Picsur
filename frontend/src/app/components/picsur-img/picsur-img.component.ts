import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { SupportedMimeCategory } from 'picsur-shared/dist/dto/mimes.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { URLRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { Logger } from 'src/app/services/logger/logger.service';
import { QoiWorkerService } from 'src/app/workers/qoi-worker.service';

enum PicsurImgState {
  Loading = 'loading',
  Canvas = 'canvas',
  Image = 'image',
}

@Component({
  selector: 'picsur-img',
  templateUrl: './picsur-img.component.html',
  styleUrls: ['./picsur-img.component.scss'],
})
export class PicsurImgComponent implements OnChanges {
  private readonly logger = new Logger('ZodImgComponent');

  @ViewChild('targetcanvas') canvas: ElementRef<HTMLCanvasElement>;

  @Input('src') imageURL: string | undefined;

  public state: PicsurImgState = PicsurImgState.Loading;

  constructor(private qoiWorker: QoiWorkerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    let url = this.imageURL ?? '';
    if (URLRegex.test(url)) {
      this.update(url).catch((err) => this.logger.error(err));
    } else {
      this.state = PicsurImgState.Loading;
    }
  }

  private async update(url: string) {
    const mime = await this.getMime(url);
    if (HasFailed(mime)) {
      this.logger.error(mime.getReason());
      return;
    }

    if (mime.type === SupportedMimeCategory.Image) {
      const result = await this.qoiWorker.decode(url);

      const canvas = this.canvas.nativeElement;
      canvas.height = result.height;
      canvas.width = result.width;
      canvas.getContext('2d')?.putImageData(result.data, 0, 0);

      this.state = PicsurImgState.Canvas;
    } else if (mime.type === SupportedMimeCategory.Animation) {
      this.state = PicsurImgState.Image;
    } else {
      this.logger.error(`Unsupported mime type: ${mime.type}`);
    }
  }

  private async getMime(url: string) {
    const response = await fetch(url, {
      method: 'HEAD',
    });
    const mimeHeader = response.headers.get('content-type') ?? '';
    const mime = mimeHeader.split(';')[0];

    const fullMime = ParseMime(mime);
    return fullMime;
  }
}
