import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { ErrorManagerModule } from '../../util/error-manager/error-manager.module';
import { CustomDropzone } from './dropzone/dropzone.component';
import { UploadComponent } from './upload.component';
import { UploadRoutingModule } from './upload.routing.module';

@NgModule({
  declarations: [UploadComponent, CustomDropzone],
  imports: [
    CommonModule,
    ErrorManagerModule,
    UploadRoutingModule,
    ReactiveFormsModule,
    DropzoneCdkModule,
  ],
})
export default class UploadRouteModule {}
