import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ImageLinks } from 'picsur-shared/dist/dto/image-links.class';
import {
  AnimFileType,
  FileType,
  FileType2Ext,
  ImageFileType,
  SupportedFileTypeCategory,
  SupportedFileTypes
} from 'picsur-shared/dist/dto/mimes.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';

import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed, HasSuccess } from 'picsur-shared/dist/types';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { ImageService } from 'src/app/services/api/image.service';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UserService } from 'src/app/services/api/user.service';
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
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
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

  public canDelete: boolean = false;

  async ngOnInit() {
    this.subscribePermissions();

    // Extract and verify params
    const params = this.route.snapshot.paramMap;

    this.id = params.get('id') ?? '';
    if (!UUIDRegex.test(this.id)) {
      return this.utilService.quitError('Invalid image link');
    }

    // Get metadata
    const metadata = await this.imageService.GetImageMeta(this.id);
    if (HasFailed(metadata))
      return this.utilService.quitError(metadata.getReason());

    // Get width of screen in pixels
    const width = window.innerWidth * window.devicePixelRatio;

    // Populate fields with metadata
    this.previewLink =
      this.imageService.GetImageURL(this.id, metadata.fileTypes.master) +
      (width > 1 ? `?width=${width}&shrinkonly=yes` : '');

    this.hasOriginal = metadata.fileTypes.original !== undefined;

    this.imageUser = metadata.user;
    this.image = metadata.image;

    // Populate default selected format
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
    this.updatePermissions();
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

  goBackHome() {
    this.router.navigate(['/']);
  }

  async deleteImage() {
    const pressedButton = await this.utilService.showDialog({
      title: `Are you sure you want to delete the image?`,
      description: 'This action cannot be undone.',
      buttons: [
        {
          name: 'cancel',
          text: 'Cancel',
        },
        {
          color: 'warn',
          name: 'delete',
          text: 'Delete',
        },
      ],
    });

    if (pressedButton === 'delete') {
      const result = await this.imageService.DeleteImage(this.id);
      if (HasFailed(result)) {
        return this.utilService.showSnackBar(
          'Failed to delete image',
          SnackBarType.Error,
        );
      }

      this.utilService.showSnackBar('Image deleted', SnackBarType.Success);

      this.router.navigate(['/']);
    }
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

  @AutoUnsubscribe()
  private subscribePermissions() {
    return this.permissionService.live.subscribe(
      this.updatePermissions.bind(this),
    );
  }

  private updatePermissions() {
    const permissions = this.permissionService.snapshot;
    if (permissions.includes(Permission.ImageAdmin)) {
      this.canDelete = true;
      return;
    }

    if (this.imageUser === null) return;

    if (
      permissions.includes(Permission.ImageUpload) &&
      this.imageUser.id === this.userService.snapshot?.id
    ) {
      this.canDelete = true;
      return;
    }

    this.canDelete = false;
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

    newOptions.push(
      ...SupportedFileTypes.map((mime) => {
        let ext = FileType2Ext(mime);
        if (HasFailed(ext)) ext = 'Error';
        return {
          value: ext.toUpperCase(),
          key: mime,
        };
      }),
    );

    return newOptions;
  }
}
