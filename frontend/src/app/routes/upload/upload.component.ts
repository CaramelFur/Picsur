import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { debounceTime } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { PermissionService } from 'src/app/services/api/permission.service';
import { UtilService } from 'src/app/util/util-module/util.service';
import { ProcessingViewMeta } from '../../models/dto/processing-view-meta.dto';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  canUpload = true;

  constructor(
    private readonly utilService: UtilService,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
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
    if (event.addedFiles.length > 1) {
      this.utilService.showSnackBar(
        'You uploaded multiple images, only one has been uploaded',
      );
    }

    const metadata: ProcessingViewMeta = {
      imageFile: event.addedFiles[0],
    };
    this.router.navigate(['/processing'], { state: metadata });
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) {
      this.utilService.showSnackBar('Your clipboard is empty');
      return;
    }

    const filteredItems = Array.from(items).filter(
      (item) => item.kind === 'file',
    );

    if (filteredItems.length === 0) {
      this.utilService.showSnackBar(
        'Your clipboard does not contain any images',
      );
      return;
    }

    const blob = filteredItems[0].getAsFile();
    if (!blob) {
      this.utilService.showSnackBar(
        'Error getting image from clipboard',
        SnackBarType.Error,
      );
      return;
    }

    if (filteredItems.length > 1) {
      this.utilService.showSnackBar(
        'You pasted multiple images, only one has been uploaded',
      );
    }

    const metadata: ProcessingViewMeta = {
      imageFile: blob,
    };

    this.router.navigate(['/processing'], { state: metadata });
  }
}
