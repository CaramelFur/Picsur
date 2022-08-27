import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.class';
import {
  AnimFileType,
  FileType,
  FileType2Ext,
  ImageFileType,
  SupportedAnimFileTypes,
  SupportedFileTypeCategory,
  SupportedImageFileTypes
} from 'picsur-shared/dist/dto/mimes.dto';

import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed, HasSuccess } from 'picsur-shared/dist/types';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { ImageService } from 'src/app/services/api/image.service';
import { UtilService } from 'src/app/util/util-module/util.service';
import {
  CustomizeDialogComponent,
  CustomizeDialogData
} from './customize-dialog/customize-dialog.component';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageService,
    private readonly utilService: UtilService,
  ) {}

  private id: string;
  private hasOriginal: boolean = false;
  private masterFileType: FileType = {
    identifier: ImageFileType.JPEG,
    category: SupportedFileTypeCategory.Image,
  };
  private currentSelectedFormat: string = ImageFileType.JPEG;

  public formatOptions: {
    value: string;
    key: string;
  }[] = [];

  public setSelectedFormat: string = ImageFileType.JPEG;

  public previewLink = '';
  public imageLinks = new ImageLinks();

  public image: EImage | null = null;
  public imageUser: EUser | null = null;

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
      metadata.fileTypes.master,
    );

    this.hasOriginal = metadata.fileTypes.original !== undefined;

    this.imageUser = metadata.user;
    this.image = metadata.image;

    const masterFiletype = ParseFileType(metadata.fileTypes.master);
    if (HasSuccess(masterFiletype)) {
      this.masterFileType = masterFiletype;
    }

    if (this.masterFileType.category === SupportedFileTypeCategory.Image) {
      this.setSelectedFormat = ImageFileType.JPEG;
    } else if (
      this.masterFileType.category === SupportedFileTypeCategory.Animation
    ) {
      this.setSelectedFormat = AnimFileType.GIF;
    } else {
      this.setSelectedFormat = metadata.fileTypes.master;
    }

    this.selectedFormat(this.setSelectedFormat);
    this.updateFormatOptions();
  }

  selectedFormat(format: string) {
    this.currentSelectedFormat = format;
    if (format === 'original') {
      this.imageLinks = this.imageService.CreateImageLinksFromID(this.id, null);
    } else {
      this.imageLinks = this.imageService.CreateImageLinksFromID(
        this.id,
        format,
      );
    }
  }

  download() {
    this.utilService.downloadFile(this.imageLinks.source);
  }

  share() {
    this.utilService.shareFile(this.imageLinks.source);
  }

  async customize() {
    const options: CustomizeDialogData = {
      imageID: this.id,
      selectedFormat: this.currentSelectedFormat,
      formatOptions: this.getBaseFormatOptions(),
    };

    if (options.selectedFormat === 'original') {
      options.selectedFormat = this.masterFileType.identifier;
    }

    await this.utilService.showCustomDialog(CustomizeDialogComponent, options, {
      dismissable: false,
    });
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

    newOptions = newOptions.concat(this.getBaseFormatOptions());

    this.formatOptions = newOptions;
  }

  private getBaseFormatOptions() {
    let newOptions: {
      value: string;
      key: string;
    }[] = [];

    if (this.masterFileType.category === SupportedFileTypeCategory.Image) {
      newOptions.push(
        ...SupportedImageFileTypes.map((mime) => {
          let ext = FileType2Ext(mime);
          if (HasFailed(ext)) ext = 'Error';
          return {
            value: ext.toUpperCase(),
            key: mime,
          };
        }),
      );
    } else if (
      this.masterFileType.category === SupportedFileTypeCategory.Animation
    ) {
      newOptions.push(
        ...SupportedAnimFileTypes.map((mime) => {
          let ext = FileType2Ext(mime);
          if (HasFailed(ext)) ext = 'Error';
          return {
            value: ext.toUpperCase(),
            key: mime,
          };
        }),
      );
    }

    return newOptions;
  }
}
