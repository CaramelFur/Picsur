import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Permission, Permissions } from 'picsur-shared/dist/dto/permissions';
import { PermissionService } from 'src/app/api/permission.service';
import { UtilService } from 'src/app/util/util.service';
import { ProcessingViewMetadata } from '../../models/processing-view-metadata';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  private permissions: Permissions = [];

  // Lets be optimistic here, this makes for a better ux
  public get hasUploadPermission() {
    return this.permissions.includes(Permission.ImageUpload);
  }

  constructor(
    private utilService: UtilService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onPermission();
  }

  @AutoUnsubscribe()
  onPermission() {
    return this.permissionService.live.subscribe((permissions) => {
      this.permissions = permissions;
    });
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    if (event.addedFiles.length > 1) {
      this.utilService.showSnackBar(
        'You uploaded multiple images, only one has been uploaded'
      );
    }

    const metadata: ProcessingViewMetadata = {
      imageFile: event.addedFiles[0],
    };
    this.router.navigate(['/processing'], { state: metadata });
  }
}
