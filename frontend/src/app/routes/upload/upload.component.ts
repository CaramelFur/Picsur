import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { debounceTime } from 'rxjs';
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
    private utilService: UtilService,
    private permissionService: PermissionService,
    private router: Router,
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
}
