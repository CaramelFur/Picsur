import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { Fail, FT } from 'picsur-shared/dist/types';
import { debounceTime } from 'rxjs';
import { PermissionService } from 'src/app/services/api/permission.service';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';
import { ProcessingViewMeta } from '../../models/dto/processing-view-meta.dto';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  private readonly logger = new Logger(UploadComponent.name);

  canUpload = true;

  constructor(
    private readonly router: Router,
    private readonly permissionService: PermissionService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.onPermission();
  }

  @AutoUnsubscribe()
  onPermission() {
    return this.permissionService.live
      .pipe(debounceTime(100))
      .subscribe((permissions) => {
        this.canUpload = permissions.includes(Permission.ImageUpload);
      });
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    if (event.addedFiles.length > 1)
      this.errorService.log(
        'You uploaded multiple images, only one has been uploaded',
      );

    const metadata: ProcessingViewMeta = {
      imageFile: event.addedFiles[0],
    };
    this.router.navigate(['/processing'], { state: metadata });
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return this.errorService.info('Your clipboard is empty');

    const filteredItems = Array.from(items).filter(
      (item) => item.kind === 'file',
    );

    if (filteredItems.length === 0)
      return this.errorService.info(
        'Your clipboard does not contain any images',
      );

    const blob = filteredItems[0].getAsFile();
    if (!blob)
      return this.errorService.showFailure(
        Fail(FT.Internal, 'Error getting image from clipboard'),
        this.logger,
      );

    if (filteredItems.length > 1)
      this.errorService.log(
        'You pasted multiple images, only one has been uploaded',
      );

    const metadata: ProcessingViewMeta = {
      imageFile: blob,
    };

    this.router.navigate(['/processing'], { state: metadata });
  }
}
