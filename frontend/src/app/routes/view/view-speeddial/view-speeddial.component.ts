import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { ImageService } from '../../../services/api/image.service';
import { PermissionService } from '../../../services/api/permission.service';
import { UserService } from '../../../services/api/user.service';
import { Logger } from '../../../services/logger/logger.service';
import { DialogService } from '../../../util/dialog-manager/dialog.service';
import { DownloadService } from '../../../util/download-manager/download.service';
import { ErrorService } from '../../../util/error-manager/error.service';
import { UtilService } from '../../../util/util.service';
import {
  CustomizeDialogComponent,
  CustomizeDialogData,
} from '../customize-dialog/customize-dialog.component';
import {
  EditDialogComponent,
  EditDialogData,
} from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'view-speeddial',
  templateUrl: './view-speeddial.component.html',
  styleUrls: ['./view-speeddial.component.scss'],
})
export class ViewSpeeddialComponent implements OnInit {
  private readonly logger = new Logger(ViewSpeeddialComponent.name);

  public canManage = false;

  @Input() public metadata: ImageMetaResponse | null = null;
  @Output() public metadataChange = new EventEmitter<ImageMetaResponse>();

  @Input() public selectedFormat: string = ImageFileType.JPEG;

  public get image(): EImage | null {
    return this.metadata?.image ?? null;
  }

  public get user(): EUser | null {
    return this.metadata?.user ?? null;
  }

  constructor(
    private readonly permissionService: PermissionService,
    private readonly downloadService: DownloadService,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
    private readonly imageService: ImageService,
    private readonly utilService: UtilService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.subscribePermissions();
  }

  @AutoUnsubscribe()
  private subscribePermissions() {
    this.updatePermissions(this.permissionService.snapshot);
    return this.permissionService.live.subscribe(
      this.updatePermissions.bind(this),
    );
  }

  private updatePermissions(permissions: string[]) {
    if (permissions.includes(Permission.ImageAdmin)) {
      this.canManage = true;
      return;
    }

    if (this.user === null) return;

    if (
      permissions.includes(Permission.ImageManage) &&
      this.user.id === this.userService.snapshot?.id
    ) {
      this.canManage = true;
      return;
    }

    this.canManage = false;
  }

  download() {
    if (this.image === null) return;

    this.downloadService.downloadFile(
      this.imageService.GetImageURL(this.image?.id, this.selectedFormat),
    );
  }

  share() {
    if (this.image === null) return;

    this.downloadService.shareFile(
      this.imageService.GetImageURL(this.image?.id, this.selectedFormat),
    );
  }

  async deleteImage() {
    if (this.image === null) return;

    const pressedButton = await this.dialogService.showDialog({
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
      const result = await this.imageService.DeleteImage(this.image.id);
      if (HasFailed(result))
        return this.errorService.showFailure(result, this.logger);

      this.errorService.success('Image deleted');

      this.router.navigate(['/']);
    }
  }

  async customize() {
    if (this.image === null) return;

    const options: CustomizeDialogData = {
      imageID: this.image.id,
      selectedFormat: this.selectedFormat,
      formatOptions: this.utilService.getBaseFormatOptions(),
    };

    if (options.selectedFormat === 'original') {
      options.selectedFormat = ImageFileType.JPEG;
    }

    await this.dialogService.showCustomDialog(
      CustomizeDialogComponent,
      options,
    );
  }

  async editImage() {
    if (this.image === null) return;

    const options: EditDialogData = {
      image: { ...this.image },
    };

    const res: EImage | null = await this.dialogService.showCustomDialog(
      EditDialogComponent,
      options,
    );

    if (res && this.metadata !== null) {
      this.metadataChange.emit({ ...this.metadata, image: res });
    }
  }
}
