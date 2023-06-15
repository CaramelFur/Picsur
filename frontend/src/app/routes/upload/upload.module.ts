import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadComponent } from './upload.component';
import { UploadRoutingModule } from './upload.routing.module';
import { ErrorManagerModule } from '../../util/error-manager/error-manager.module';

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    UploadRoutingModule,
    NgxDropzoneModule,
  ],
})
export default class UploadRouteModule {}
