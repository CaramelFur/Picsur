import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.class';
import {
  AnimFileType,
  ImageFileType,
  SupportedFileTypeCategory,
} from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

import { HasFailed } from 'picsur-shared/dist/types/failable';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { Subscription, timer } from 'rxjs';
import { ImageService } from '../../services/api/image.service';
import { Logger } from '../../services/logger/logger.service';
import { ErrorService } from '../../util/error-manager/error.service';
import { UtilService } from '../../util/util.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit, OnDestroy {
  private readonly logger = new Logger(ViewComponent.name);

  private expires_timeout: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly errorService: ErrorService,
    private readonly utilService: UtilService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  private id = '';
  public metadata: ImageMetaResponse | null = null;
  public set OnMetadata(metadata: ImageMetaResponse) {
    this.metadata = metadata;
    this.subscribeTimeout(metadata.image.expires_at);

    this.changeDetector.markForCheck();
  }

  public formatOptions: {
    value: string;
    key: string;
  }[] = [];

  public selectedFormat: string = ImageFileType.JPEG;

  public get image(): EImage | null {
    return this.metadata?.image ?? null;
  }

  public get user(): EUser | null {
    return this.metadata?.user ?? null;
  }

  public get hasOriginal(): boolean {
    if (this.metadata === null) return false;
    return this.metadata.fileTypes.original !== undefined;
  }

  public get previewLink(): string {
    if (this.metadata === null) return '';

    // Get width of screen in pixels
    const width = window.innerWidth * window.devicePixelRatio;

    return (
      this.imageService.GetImageURL(this.id, this.metadata.fileTypes.master) +
      (width > 1 ? `?width=${width}&shrinkonly=yes` : '')
    );
  }

  private imageLinksCache: Record<string, ImageLinks> = {};
  public get imageLinks(): ImageLinks {
    if (this.imageLinksCache[this.selectedFormat] !== undefined)
      return this.imageLinksCache[this.selectedFormat];

    const format = this.selectedFormat;
    const links = this.imageService.CreateImageLinksFromID(
      this.id,
      format === 'original' ? null : format,
      this.image?.file_name,
    );

    this.imageLinksCache[format] = links;
    return links;
  }

  async ngOnInit() {
    // Extract and verify params
    {
      const params = this.route.snapshot.paramMap;

      this.id = params.get('id') ?? '';
      if (!UUIDRegex.test(this.id)) {
        return this.errorService.quitError('Invalid image link', this.logger);
      }
    }

    // Get metadata
    {
      const metadata = await this.imageService.GetImageMeta(this.id);
      if (HasFailed(metadata))
        return this.errorService.quitFailure(metadata, this.logger);

      if (metadata.image.expires_at !== null) {
        if (metadata.image.expires_at <= new Date())
          return this.errorService.quitWarn('Image not found', this.logger);

        this.subscribeTimeout(metadata.image.expires_at);
      }

      this.metadata = metadata;
    }

    // Populate default selected format
    {
      let masterFiletype = ParseFileType(this.metadata.fileTypes.master);
      if (HasFailed(masterFiletype)) {
        masterFiletype = {
          identifier: ImageFileType.JPEG,
          category: SupportedFileTypeCategory.Image,
        };
      }

      switch (masterFiletype.category) {
        case SupportedFileTypeCategory.Image:
          this.selectedFormat = ImageFileType.JPEG;
          break;
        case SupportedFileTypeCategory.Animation:
          this.selectedFormat = AnimFileType.GIF;
          break;
        default:
          this.selectedFormat = this.metadata.fileTypes.master;
          break;
      }
    }

    this.updateFormatOptions();
    this.changeDetector.markForCheck();
  }

  ngOnDestroy() {
    if (this.expires_timeout !== null) this.expires_timeout.unsubscribe();
  }

  goBackHome() {
    this.router.navigate(['/']);
  }

  private updateFormatOptions() {
    let newOptions: {
      value: string;
      key: string;
    }[] = [];

    if (this.hasOriginal) {
      newOptions.push({
        value: 'Original',
        key: 'original',
      });
    }

    newOptions = newOptions.concat(this.utilService.getBaseFormatOptions());

    this.formatOptions = newOptions;
  }

  private subscribeTimeout(expires_at: Date | null) {
    if (this.expires_timeout !== null) this.expires_timeout.unsubscribe();

    if (expires_at === null) return;

    this.expires_timeout = timer(expires_at).subscribe(() => {
      this.errorService.quitWarn('Image expired', this.logger);
    });
  }
}
