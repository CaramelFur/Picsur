import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.dto';
import {
  AnimMime,
  FullMime,
  ImageMime,
  Mime2Ext,
  SupportedAnimMimes,
  SupportedImageMimes,
  SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { HasFailed, HasSuccess } from 'picsur-shared/dist/types';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { ImageService } from 'src/app/services/api/image.service';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private utilService: UtilService
  ) {}

  private id: string;
  private hasOriginal: boolean = false;
  private masterMime: FullMime = {
    mime: ImageMime.JPEG,
    type: SupportedMimeCategory.Image,
  };

  public formatOptions: {
    value: string;
    key: string;
  }[] = [];

  public setSelectedValue: string = ImageMime.JPEG;

  public previewLink = '';
  public imageLinks = new ImageLinks();

  async ngOnInit() {
    const params = this.route.snapshot.paramMap;

    this.id = params.get('id') ?? '';
    if (!UUIDRegex.test(this.id)) {
      return this.utilService.quitError('Invalid image link');
    }

    const metadata = await this.imageService.GetImageMeta(this.id);
    if (HasFailed(metadata))
      return this.utilService.quitError(metadata.getReason());

    this.previewLink = this.imageService.GetImageURL(
      this.id,
      metadata.fileMimes.master
    );

    this.hasOriginal = metadata.fileMimes.original !== undefined;

    const masterMime = ParseMime(metadata.fileMimes.master);
    if (HasSuccess(masterMime)) {
      this.masterMime = masterMime;
    }

    if (this.masterMime.type === SupportedMimeCategory.Image) {
      this.setSelectedValue = ImageMime.JPEG;
    } else if (this.masterMime.type === SupportedMimeCategory.Animation) {
      this.setSelectedValue = AnimMime.GIF;
    } else {
      this.setSelectedValue = metadata.fileMimes.master;
    }

    this.selectedFormat(this.setSelectedValue);
    this.updateFormatOptions();
  }

  selectedFormat(format: string) {
    if (format === 'original') {
      this.imageLinks = this.imageService.CreateImageLinksFromID(this.id, null);
    } else {
      this.imageLinks = this.imageService.CreateImageLinksFromID(
        this.id,
        format
      );
    }
  }

  download() {
    this.utilService.downloadFile(this.imageLinks.source);
  }

  share() {
    this.utilService.shareFile(this.imageLinks.source);
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

    if (this.masterMime.type === SupportedMimeCategory.Image) {
      newOptions.push(
        ...SupportedImageMimes.map((mime) => ({
          value: Mime2Ext(mime)?.toUpperCase() ?? 'Error',
          key: mime,
        }))
      );
    } else if (this.masterMime.type === SupportedMimeCategory.Animation) {
      newOptions.push(
        ...SupportedAnimMimes.map((mime) => ({
          value: Mime2Ext(mime)?.toUpperCase() ?? 'Error',
          key: mime,
        }))
      );
    }

    this.formatOptions = newOptions;
  }
}
