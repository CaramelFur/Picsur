import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ErrorManagerModule } from 'src/app/util/error-manager/error-manager.module';
import { UploadComponent } from './upload.component';
import { UploadRoutingModule } from './upload.routing.module';

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
