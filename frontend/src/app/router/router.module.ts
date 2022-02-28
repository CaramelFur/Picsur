import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from '../routes/upload/upload.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { ProcessingComponent } from '../routes/processing/processing.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [
  { path: '', component: UploadComponent },
  {
    path: 'processing',
    component: ProcessingComponent,
  },
];

@NgModule({
  imports: [
    NgxDropzoneModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [UploadComponent, ProcessingComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'left',
        panelClass: ['mat-toolbar', 'mat-primary'],
      },
    },
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
