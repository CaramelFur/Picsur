import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FileInputValue } from '@ngx-dropzone/cdk';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { Fail, FT } from 'picsur-shared/dist/types/failable';
import { debounceTime } from 'rxjs';
import { ProcessingViewMeta } from '../../models/dto/processing-view-meta.dto';
import { PermissionService } from '../../services/api/permission.service';
import { Logger } from '../../services/logger/logger.service';
import { ErrorService } from '../../util/error-manager/error.service';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  private readonly logger = new Logger(UploadComponent.name);

  canUpload = true;

  fileControl = new FormControl<FileInputValue>(null);

  constructor(
    private readonly router: Router,
    private readonly permissionService: PermissionService,
    private readonly errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.onPermission();
    this.onFileChange();
  }

  @AutoUnsubscribe()
  onFileChange() {
    return this.fileControl.valueChanges.subscribe((file) => {
      if (!file) return;
      let files = Array.isArray(file) ? file : [file];
      const metadata: ProcessingViewMeta = new ProcessingViewMeta(files);
      this.router.navigate(['/processing'], { state: metadata });
    });
  }

  @AutoUnsubscribe()
  onPermission() {
    return this.permissionService.live
      .pipe(debounceTime(100))
      .subscribe((permissions) => {
        this.canUpload = permissions.includes(Permission.ImageUpload);
      });
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

    const blobs = filteredItems.map((item) => item.getAsFile());
    if (blobs.some((blob) => blob === null))
      return this.errorService.showFailure(
        Fail(FT.Internal, 'Error getting image from clipboard'),
        this.logger,
      );

    const safeBlob = blobs as File[];

    const metadata: ProcessingViewMeta = new ProcessingViewMeta(safeBlob);

    this.router.navigate(['/processing'], { state: metadata });
  }
}
